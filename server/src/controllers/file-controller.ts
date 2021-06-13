import { Request, Response } from 'express';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { Types } from 'mongoose';
import File from '../models/file';
import User from '../models/user';
import IFile from '../models/interfaces/IFile';
import IUser from '../models/interfaces/IUser';

const UPLOAD_DIR = process.env.UPLOAD_DIR
const TEMP_DIR = process.env.TEMP_DIR

export default class FileController {
  construct() {}

  download = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
    const userId = res.locals.id
    const file = req.body

    let location = UPLOAD_DIR + userId + file.path + file.name

    if (file.isDir) {
      const outputPath = TEMP_DIR + `/${file.name}.zip`
      const output = fs.createWriteStream(outputPath)
      const archive = archiver('zip')

      output.on('finish', () => {
        return res.download(outputPath, (err) => {
          if (err) {
            console.log(err)
          }
          fs.promises.unlink(outputPath)
        })
      })

      output.on('error', (err) => {
        console.log(err)
        return res.status(500).json({ success: false, error: err })
      })

      archive.pipe(output)
      archive.directory(location, file.name)
      archive.finalize()
    } else {
      return res.download(location)
    }
  }

  uploadFile = async (req: Request, res: Response) => {
    const { filename, size } = req.file
    const userId = req.res.locals.user.id;
    const path = req.body.path

    const file: IFile = new File({
      _id: new Types.ObjectId(),
      owner: userId,
      name: filename,
      path: path,
      size_bytes: size,
      isDir: false,
      createdAt: new Date(),
    });

    file.save();

    User.findByIdAndUpdate({ _id: userId })
      .then((result: IUser, err: Error) => {
        result.files.push(file.id)
        result.save()
      })
      .catch((err: Error) => {
        res.status(500).json({
          success: false,
          error: 'Invalid user',
        })
      });

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
      res.status(500).json({ 
        success: false,
        error: 'File already contains in the directory'
      });
    }

    const userId = res.locals.user.id;
    const path = req.body.path;

    File.find({ owner: userId, path: path })
      .select('id name isDir size_bytes createdAt')
      .then(files => {
        res.status(200).json(files);
    });
  }

  createFolder = async (req: Request, res: Response) => {
    const userId = res.locals.user.id
    const path = req.body.path
    const folder = req.body.folder

    fs.promises
      .mkdir(UPLOAD_DIR + userId + path + folder)
      .then(() => {
        res
          .status(200)
          .json({ success: true, message: 'Folder created successfully' })
      })
      .catch((err) => res.status(500).json({ success: false, error: err }))
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
