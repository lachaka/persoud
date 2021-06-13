import { Request, Response } from 'express';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { Types } from 'mongoose';
import File from '../models/file';
import User from '../models/user';
import IFile from '../models/interfaces/IFile';
import IUser from '../models/interfaces/IUser';

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const TEMP_DIR = process.env.TEMP_DIR;

export default class FileController {
  construct() {}

  download = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    const user = res.locals.user;
    const file = req.body;

    let location = UPLOAD_DIR + user.id + file.path + file.name;

    if (file.isDir) {
      const outputPath = TEMP_DIR + `/${file.name}.zip`;
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip');

      output.on('finish', () => {
        return res.download(outputPath, (err) => {
          if (err) {
            console.log(err);
          }
          fs.promises.unlink(outputPath);
        });
      });

      output.on('error', (err) => {
        console.log(err)
        return res.status(500).json({ success: false, error: err })
      });

      archive.pipe(output);
      archive.directory(location, file.name);
      archive.finalize();
    } else {
      return res.download(location);
    }
  }

  uploadFile = async (req: Request, res: Response) => {
    const { filename, size } = req.file;
    const user = res.locals.user;
    const path = req.body.path

    const file: IFile = new File({
      _id: new Types.ObjectId(),
      owner: user.id,
      name: filename,
      path: path,
      size_bytes: size,
      isDir: false,
      createdAt: new Date(),
    });

    file.save();

    user.files.push(file.id);
    user.save();

    this.updateFolderSize(file, true);

    res.status(200).json({ 
      id: file.id,
      name: file.name,
      isDir: file.isDir,
      size_bytes: file.size_bytes,
      createdAt: file.createdAt
    });
  };

  private async updateFolderSize(file: IFile, upload: boolean) {
    if (file.path !== '/') {
      File.findOneAndUpdate({ owner: file.owner, path: file.path })
        .then((result: IFile, err: Error) => {
          if (upload) {
            result.size_bytes += file.size_bytes;
          } else {
            result.size_bytes -= file.size_bytes;
          }
          result.save();
        });
    }
  }

  getFiles = async (req: Request, res: Response) => {
    if (res.locals.fileContains) {
      res.status(400).json({ 
        success: false,
        error: 'File already contains in the current directory'
      });
    } 
    
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

    const folder: IFile = new File({
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
    const userId = res.locals.user.id
    const file = req.body
    const fileLocation = UPLOAD_DIR + userId + file.path + file.name

    if (file.isDir) {
      fs.promises
        .rm(fileLocation, {
          recursive: true,
          force: true,
        })
        .then(() => {
          res.status(200).json({ success: true, message: 'File is deleted' })
        })
        .catch((err) => res.status(500).json({ success: false, error: err }))
    } else {
      fs.promises
        .unlink(fileLocation)
        .then(() => {
          res.status(200).json({ success: true, message: 'File is deleted' })
        })
        .catch((err) => res.status(500).json({ success: false, error: err }))
    }
  }

  shareFile = async (req: Request, res: Response) => {}

  search = async (req: Request, res: Response) => {}
}
