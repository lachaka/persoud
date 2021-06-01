import * as express from 'express';
import * as fs from 'fs';
import upload from '../config/multer-config';

require('dotenv').config(); 
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const files = express.Router();

const baseUrl = 'http://localhost:3000/files/';

files.get('/:filename', async (req: express.Request, res: express.Response) => {
    const filename = req.params.filename;
    const path = req.query.path || "";

    res.download(UPLOAD_DIR + path + filename);
});

files.post('/upload', upload.single('file'), async (req: express.Request, res: express.Response) => {
    res.status(200).send({ message: 'File uploaded successfully!' });
});

files.get('/', async (req: express.Request, res: express.Response) => {
    const path = req.query.path || "";
    const location = UPLOAD_DIR + path;

    fs.readdir(location, (err, files) => {
        if (err) {
            res.status(500).send({
                message: 'Can not scan files',
            });
        }

        let filesInfo = [];
        files.forEach((file) => {
            filesInfo.push({
                name: file,
                url: baseUrl + file + "?path=" + path,
                size: fs.statSync(location).size,
                isDir: fs.statSync(location + file).isDirectory()
            });
        });
        
        res.status(200).send(filesInfo);
    });
});

// files.post("/images", upload.array("files", 4), (req, res) =>{
//     try {
//       res.send(req.files);
//     } catch (error) {
//       console.log(error);
//       res.send(400);
//     }
//   });

export default files;