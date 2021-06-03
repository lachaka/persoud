import * as express from 'express';
import * as fs from 'fs';
import upload from '../config/multer-config';

require('dotenv').config(); 
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const files = express.Router();

const baseUrl = 'http://localhost:3000/files/';

files.post('/download', async (req: express.Request, res: express.Response) => {
    const filename = req.body.filename;
    const path = req.body.path;

    res.download(UPLOAD_DIR + path + filename);
});

files.post('/upload', upload.single('file'), async (req: express.Request, res: express.Response) => {
    res.status(200).send({ message: 'File uploaded successfully!' });
});

files.post('/', async (req: express.Request, res: express.Response) => {
    const path = req.body.path;
    const location = UPLOAD_DIR + path;
    
    fs.readdir(location, (err, files) => {
        if (err) {
            res.status(500).send({
                message: 'Can not scan files',
            });
        }

        const filesInfo = files.map(file => ({
            name: file,
            path: path,
            size: fs.statSync(location).size,
            isDir: fs.statSync(location + file).isDirectory()
        }));
                
        res.status(200).send(filesInfo);
    });
});

files.post('/folder', async (req: express.Request, res: express.Response) => {
    const folder = req.body.folder;
    const path = req.body.path;

    fs.promises.mkdir(UPLOAD_DIR + path + folder ).then(() => {
        res.status(200).send({ message: 'Folder created successfully!' });
    }).catch (err => {
        res.status(500).send({ err });
    });
});

files.post('/delete', async (req: express.Request, res: express.Response) => {
    const file = req.body;
    
    if (file.isDir) {
        fs.rmdirSync(UPLOAD_DIR + file.path + file.name, { recursive: true });
        // TODO should be async
    } else {
        fs.promises.unlink(UPLOAD_DIR + file.path + file.name).then(() => {
            res.status(200).send({message: 'File is deleted'});
        }).catch(err => {
            res.status(500).send({err});
        });
    }
        
});


export default files;