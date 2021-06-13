import { Request, Response } from 'express';
import * as fs from 'fs';
import * as archiver from 'archiver';

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const TEMP_DIR = process.env.TEMP_DIR;

export default class FileController {
  construct() {}

  download = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    const userId = res.locals.id;
    const file = req.body;

    let location = UPLOAD_DIR + userId + file.path + file.name;

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
        console.log(err);
        return res.status(500).json({ success: false, error: err });
      });

      archive.pipe(output);
      archive.directory(location, file.name);
      archive.finalize();
    } else {
      return res.download(location);
    }
  };

  uploadFile = async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'File uploaded successfully!' });
  };

  getFiles = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const path = req.body.path;
    const location = UPLOAD_DIR + res.locals.user.id + path;

    // fs.readdir(location, (err, files) => {
    //   if (err) {
    //     res.status(500).json({ success: false, error: err });
    //   }
      
    //   const filesInfo = files.map((file) => ({
    //     name: file,
    //     path: path,
    //     size: fs.statSync(location).size,
    //     isDir: fs.statSync(location + file).isDirectory(),
    //   }));

    //   res.status(200).json({ files: filesInfo });
    // });
  };

  createFolder = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const path = req.body.path;
    const folder = req.body.folder;

    fs.promises
      .mkdir(UPLOAD_DIR + userId + path + folder)
      .then(() => {
        res.status(200).json({ success: true, message: 'Folder created successfully' });
      })
      .catch((err) => res.status(500).json({ success: false, error: err }));
  };

  deleteFile = async (req: Request, res: Response) => {
    const userId = res.locals.user.id;
    const file = req.body;
    const fileLocation = UPLOAD_DIR + userId + file.path + file.name;

    if (file.isDir) {
      fs.promises
        .rm(fileLocation, {
          recursive: true,
          force: true,
        })
        .then(() => {
          res.status(200).json({ success: true, message: 'File is deleted' })
        })
        .catch((err) => res.status(500).json({ success: false, error: err }));
    } else {
      fs.promises
        .unlink(fileLocation)
        .then(() => {
          res.status(200).json({ success: true, message: 'File is deleted' })
        })
        .catch((err) => res.status(500).json({ success: false, error: err }));
    }
  };

  shareFile = async (req: Request, res: Response) => {
    
  };
}
