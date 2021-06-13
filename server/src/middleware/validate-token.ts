import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/user';

const verifyAuth = (req: Request, res: Response, next: () => void): void => {
  const token = req.cookies.auth_cookie;
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, email): void => {
      if (err) {
        res.status(401).json({ success: false, message: 'Session expired' });
      }

      User.findOne({ email: email.email }, (err, user) => {
        res.locals.user = { id: user.id };
        next();
      });
    });
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized' });
  }
};

export default verifyAuth;
