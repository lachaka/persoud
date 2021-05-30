import * as multer from 'multer';

require('dotenv').config(); 
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
        callback(null, UPLOAD_DIR);
    },
    filename: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
        callback(null, file.originalname);
    }
});

const upload = multer({storage: storage});

export default upload;