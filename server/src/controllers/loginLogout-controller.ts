import { Request, Response, response } from 'express';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import User from '../models/user';
import IUser from '../models/interfaces/IUser';

export default class LoginLogoutController {
  construct() {}

  register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    this.notExists(emailVar)
      .then(() => {
        const newUser = new User({
          email: emailVar,
          password: bcrypt.password,
        });

        //add user
        res.status(200).send('User created.');
      })
      .catch(() => {
        res.status(400).send('User already exists.');
      });
  };

  notExists = (emailVar: string) => {
    return new Promise(async (res, rej) => {
      const user = await User.findOne({ email: emailVar }).exec();
      if (!user) {
        res(true);
      }
      rej('User does not exists');
    });
  };

  exists = (emailVar: string) => {
    return new Promise(async (res, rej) => {
      const user = await User.findOne({ email: emailVar }).exec();
      if (user) {
        res(true);
      }
      rej('User does not exists');
    });
  };

  addNewUser = async (userVar: IUser) => {
    return new Promise(async (res, rej) => {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: userVar.email,
        password: userVar.password,
      });

      await newUser
        .save()
        .then(() => {
          res(true);
        })
        .catch(() => {
          rej('Database error: user not added');
        });
    });
  };

  login = async (req: Request, res: Response) => {
    const emailVar = req.body.email;
    const passwordVar = req.body.password;

    this.exists(emailVar).then(async () => {
      const user = await User.findOne({ email: emailVar }).exec();

      if (user && (await bcrypt.compare(passwordVar, user.password))) {
        res.status(200).send('Login success!');
      }
      res.status(400).send('Invalid login');
    });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(process.env.SESSION_NAME);
    res.status(200);
  };
}
