import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import IUser from '../models/interfaces/IUser';
import generateToken from './generate-token';

const UPLOAD_DIR = process.env.UPLOAD_DIR;

export default class UserController {
  construct() {}

  findUser = async (email: string) => {
    return User.findOne({ email: email }).exec();
  };

  createUser = async (user: IUser) => {
    bcrypt.hash(user.password, 10, async (error: Error, hash: string) => {
      if (error) {
        return error;
      }

      const newUser = new User({
        email: user.email,
        password: hash,
      });

      await newUser.save();
      this.createUserFolder(newUser._id);
    });
  };

  private createUserFolder(id: Types.ObjectId) {
    fs.promises.mkdir(UPLOAD_DIR + '/' + id).catch((err) => console.log(err));
  }

  public validateUser(user: IUser): string[] {
    const errors: string[] = [];

    if (!user.email) {
      errors.push('Email is empty');
    }

    if (!user.password.match(/^[a-zA-Z0-9*.!@#$%^&(){}[\]:;<>,.?\/~_+-=|].{8,}$/)) {
      errors.push('Password must be at least 8 symbols');
    }

    return errors;
  }

  login = async (req: Request, res: Response, next: () => void) => {
    const { email, password } = req.body;

    this.findUser(email)
      .then((user) => {
        console.log(user);
        if (user) {
          bcrypt.compare(password, user.password, (error: Error, result: boolean) => {
              if (error) {
                res.status(400).json({ error: error });
              }

              if (result) {
                generateToken(res, email);
                res.status(200).json({ message: 'Login successful' });
              } else {
                res.status(401).json({ error: 'Invalid password' });
              }
            }
          );
        } else {
          res.status(401).json({ error: 'Invalid email' });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(process.env.SESSION_NAME);
    res.status(200);
  };
}
