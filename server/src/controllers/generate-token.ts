import { Response } from 'express';
import * as jwt from 'jsonwebtoken';

const generateToken = (res: Response, email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const cookie = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  };
  
  res.cookie('token', token, cookie);
};

export default generateToken;
