import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const verifyAuth = (req: Request, res: Response, next: () => void): void => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, email): void => {
      if (err) {
        res.status(401).json({ message: 'Session expired' });
      }

      res.locals.email = email;
      next();
    });
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

export default verifyAuth;
