import * as express from 'express';
import upload from '../config/multer-config';

require('dotenv').config(); 
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const files = express.Router();

files.get('/:filename', async (req: express.Request, res: express.Response) => {
    const filename = req.params.filename;
    res.download(UPLOAD_DIR + filename);
});

files.post('/upload', upload.single('file'), async (req: express.Request, res: express.Response) => {
    res.send('File uploaded successfully! -> filename = ' + req.file.filename);
});

export default files;