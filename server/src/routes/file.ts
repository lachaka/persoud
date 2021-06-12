import { Router }  from 'express';

import upload from '../config/multer-config';
import FileController from '../controllers/file-controller';

const files = Router();
const fileController: FileController = new FileController();

files.post('/download', fileController.download);

files.post('/upload', upload.single('file'), fileController.uploadFile);

files.post('/', fileController.getFiles);

files.post('/folder', fileController.createFolder);

files.post('/delete', fileController.deleteFile);

export default files;
