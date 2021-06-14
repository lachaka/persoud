import { Request, Response } from 'express';
import { File } from '../models/file';

const validateUserFile = (req: Request, res: Response, next: () => void): void => {
  const user = res.locals.user;
  const fileId = req.body.file;
  
  if (!user.files.includes(fileId)) {
    res.status(403).json({ success: false, error: 'Unknown file' });
  } else {
    File.findById(fileId, (err: Error, file) => {
      res.locals.file = file;
      next();
    });
  }
};

export default validateUserFile;