import * as multer from 'multer';
import * as fs from 'fs';

require("dotenv").config();
const UPLOAD_DIR: string = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.res.locals.user;
    
    cb(null, UPLOAD_DIR + user.id + req.body.path);
  },
  filename: (req, file, cb) => {
    const user = req.res.locals.user;
    
    if (fs.existsSync(UPLOAD_DIR + user.id  + req.body.path + file.originalname)) {
      req.res.locals.fileContains = true;
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({ storage: storage });

export default upload;
