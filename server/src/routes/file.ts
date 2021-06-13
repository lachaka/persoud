import { Router }  from 'express';

import upload from '../config/multer-config';
import FileController from '../controllers/file-controller';
import verifyAuth from '../middleware/validate-token';

const files = Router();
const fileController: FileController = new FileController();

files.post('/download', verifyAuth, fileController.download);

files.post('/upload', verifyAuth, upload.single('file'), fileController.uploadFile);

files.post('/', verifyAuth, fileController.getFiles);

files.post('/folder', verifyAuth, fileController.createFolder);

files.post('/delete', verifyAuth, fileController.deleteFile);

files.post('/shareFile', verifyAuth, fileController.shareFile);

export default files;
