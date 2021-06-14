import { Router }  from 'express';

import upload from '../config/multer-config';
import FileController from '../controllers/file-controller';
import verifyAuth from '../middleware/validate-token';
import validateUserFile from '../middleware/validate-user-file';

const files = Router();
const fileController: FileController = new FileController();

files.post('/download', verifyAuth, validateUserFile, fileController.download);

files.post('/upload', verifyAuth, upload.single('file'), fileController.uploadFile);

files.post('/', verifyAuth, fileController.getFiles);

files.post('/folder', verifyAuth, fileController.createFolder);

files.post('/delete', verifyAuth, validateUserFile, fileController.deleteFile);

files.post('/share', verifyAuth, validateUserFile, fileController.shareFile);

files.get('/shared', verifyAuth, fileController.sharedFiles);

files.post('/search', verifyAuth, fileController.search);

export default files;
