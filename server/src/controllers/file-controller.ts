import { Request, Response } from 'express';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { Types } from 'mongoose';
import IFile from '../models/interfaces/IFile';
import IUser from '../models/interfaces/IUser';
import { User, UserDocument, UserModel } from '../models/user';
import { File, FileDocument } from '../models/file';

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const TEMP_DIR = process.env.TEMP_DIR;

export default class FileController {
  construct() {}

  download = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    const user = res.locals.user;
    const file =  res.locals.file;

    let location = UPLOAD_DIR + user.id + file.path + file.name;

    if (file.isDir) {
      const outputPath = TEMP_DIR + `/${user._id}.zip`;
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip');

      output.on('finish', () => {
        res.download(outputPath, (err) => {
          if (err) {
            console.log(err);
          }
          fs.promises.unlink(outputPath);
        });
      });

      output.on('error', (err) => {
        console.log(err);
        res.status(500).json({ success: false, error: err });
      });

      archive.pipe(output);
      archive.directory(location, file.name);
      archive.finalize();
    } else {
      res.download(location);
    }
  }

  uploadFile = async (req: Request, res: Response) => {
    if (res.locals.fileContains) {
      res.status(400).json({ 
        success: false,
        error: 'File already contains in the current directory'
      });
    } 
    const { filename, size } = req.file;
    const user = res.locals.user;
    const path = req.body.path

    const file = new File({
      _id: new Types.ObjectId(),
      owner: user.id,
      name: filename,
      path: path,
      size_bytes: size,
      isDir: false,
      createdAt: new Date(),
    });

    file.save();

    user.files.push(file._id);
    user.save();

    this.updateFolderSize(file, true);

    res.status(200).json({ 
      id: file._id,
      name: file.name,
      isDir: file.isDir,
      size_bytes: file.size_bytes,
      createdAt: file.createdAt
    });
  };

  private async updateFolderSize(file, upload: boolean) {
    if (file.path !== '/') {
      File.updateOne({ owner: file.owner, path: file.path }, (result, err: Error) => {
          if (upload) {
            result.size_bytes += file.size_bytes;
          } else {
            result.size_bytes -= file.size_bytes;
          }
          result.save();
        });
    }

    // if (file.path !== '/') {
    //   File.findOneAndUpdate({ owner: file.owner, path: file.path })
    //     .then((result, err: Error) => {
    //       if (upload) {
    //         result.size_bytes += file.size_bytes;
    //       } else {
    //         result.size_bytes -= file.size_bytes;
    //       }
    //       result.save();
    //     });
    // }
  }

  getFiles = async (req: Request, res: Response) => { 
    const user = res.locals.user;
    const path = req.body.path;

    File.find({ owner: user.id, path: path })
      .select('id name isDir size_bytes createdAt')
      .then(files => res.status(200).json(files))
      .catch(err => res.status(500).json({ success: false }));
  }

  createFolder = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const path = req.body.path;
    const folderName = req.body.folder;

    const folder = new File({
      _id: new Types.ObjectId(),
      owner: user.id,
      name: folderName,
      path: path,
      isDir: true,
      createdAt: new Date(),
    });

    folder.save();

    user.files.push(folder.id);
    user.save();

    fs.promises
      .mkdir(UPLOAD_DIR + user.id + path + folderName)
      .then(() => {
        res.status(200).json({ 
          id: folder._id,
          name: folder.name,
          isDir: true,
          size: folder.size_bytes,
          createdAt: folder.createdAt
        });
      })
      .catch((err) => res.status(500).json({ success: false, error: err }));
  }

  deleteFile = async (req: Request, res: Response) => {
    const user: IUser = res.locals.user;
    const file: IFile =  res.locals.file;
    const fileLocation = UPLOAD_DIR + user._id + file.path + file.name;

    if (file.isDir) {
      fs.promises
        .rm(fileLocation, {
          recursive: true,
          force: true,
        })
        .then(() => {          
          res.status(200).json({
            success: true,
            message: 'File is deleted'
          });
        })
        .catch((err) => res.status(500).json({
          success: false,
          error: 'Could not delete file from db',
        })
      );
    } else {
      fs.promises
        .unlink(fileLocation)
        .then(() => {        
          this.removeFileFromDb(file, user);
         
          res.status(200).json({ 
            success: true,
            message: 'File is deleted'
          });
        })
        .catch((err) => res.status(500).json({ 
          success: false, 
          error: err,
        })
      );
    }
  }

  private removeFileFromDb(file: IFile, user: IUser) {    
    file.sharedWith.forEach(uid => {
      User.findByIdAndUpdate(uid, { $pull: { files: file._id }}, (err, data) => {
        if (err) { 
          throw err;
        }
      });
    });
    
    User.findByIdAndUpdate(user._id, { $pull: { files: file._id }}, (err, data) => {
      if (err) { 
        throw err;
      }
    });

    File.findByIdAndRemove(file._id, {new: true}, (err, file) => {
      if (err) {
        throw err;
      }
    });

    this.updateFolderSize(file, false);
  }

  private deleteFolderFromDb(file: IFile, user: IUser) {
  }

  shareFile = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const file =  res.locals.file;

    User.updateOne({ email: email }, { $push: { files: file._id } }, {new: true}, (err, user: UserDocument) => {
      if (err) {
        res.status(500).json({ 
          success: false, 
          error: 'invalid user email',
        });
      }
      
      file.sharedWith.add(user._id);
      file.save();
    });
  }

  sharedFiles = async (req: Request, res: Response) => {
    const user = res.locals.user;

    User.findById(user.id).populate('files', { 
      _id: 1,
      name: 1,
      size_bytes: 1,
      isDir: 1,
      createdAt: 1
    }).then(user => {
      res.status(200).json(user.files);
   });
  }

  search = async (req: Request, res: Response) => {
    const user = res.locals.user;
    console.log(req.body.filename);
    User.findById(user.id).populate({
        path: 'files', 
        match: { 'name': req.body.filename }, 
        select: '_id name size_bytes isDir createdAt' })
      .then(user => {
      res.status(200).json(user.files);
   });
  }
}
