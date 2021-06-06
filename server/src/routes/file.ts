import * as express from "express";
import * as fs from "fs";
import * as achiver from 'archiver';

import upload from "../config/multer-config";

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const TEMP_DIR = process.env.TEMP_DIR;

const files = express.Router();

files.post("/download", async (req: express.Request, res: express.Response) => {
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  
  const file = req.body;

  let location = UPLOAD_DIR + file.path + file.name;

  if (file.isDir) {
    const outputPath = TEMP_DIR + `/${file.name}.zip`;
    const output = fs.createWriteStream(outputPath);
    const archive = achiver('zip'); 

    output.on('finish', () => {
      return res.download(outputPath, err => {
          if (err) {
            console.log(err);
          }
          fs.promises.unlink(outputPath);
        });
    });
  
    output.on('error', (err) => {
      console.log(err);
      return res.status(500).send(err);
    });

    archive.pipe(output);
    archive.directory(location, file.name)
    archive.finalize();
  } else {
    return res.download(location);
  }
});

files.post(
  "/upload", upload.single("file"), async (req: express.Request, res: express.Response) => {
    res.status(200).send({ message: "File uploaded successfully!" });
  }
);

files.post("/", async (req: express.Request, res: express.Response) => {
  const path = req.body.path;
  const location = UPLOAD_DIR + path;

  fs.readdir(location, (err, files) => {
    if (err) {
      res.status(500).send(err);
    }

    const filesInfo = files.map((file) => ({
      name: file,
      path: path,
      size: fs.statSync(location).size,
      isDir: fs.statSync(location + file).isDirectory(),
    }));

    res.status(200).send(filesInfo);
  });
});

files.post("/folder", async (req: express.Request, res: express.Response) => {
  const folder = req.body.folder;
  const path = req.body.path;

  fs.promises
    .mkdir(UPLOAD_DIR + path + folder)
    .then(() =>
      res.status(200).send({ message: "Folder created successfully!" })
    )
    .catch((err) => res.status(500).send({ err }));
});

files.post("/delete", async (req: express.Request, res: express.Response) => {
  const file = req.body;

  if (file.isDir) {
    fs.promises
      .rm(UPLOAD_DIR + file.path + file.name, { recursive: true, force: true })
      .then(() => res.status(200).send({ message: "File is deleted" }))
      .catch((err) => res.status(500).send(err));
  } else {
    fs.promises
      .unlink(UPLOAD_DIR + file.path + file.name)
      .then(() => res.status(200).send({ message: "File is deleted" }))
      .catch((err) => res.status(500).send({ err }));
  }
});

export default files;
