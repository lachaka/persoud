import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import IUser from '../models/interfaces/IUser';

export default class UserController {
  construct() {}

  public async findUser(email: string) {
    return User.findOne({ email: email }).exec();
  }

  public async createUser(user: IUser) {
    bcrypt.hash(user.password, 10, async (error: Error, hash: string) => {
      if (error) {
        return error;
      }

      const newUser = new User({
        email: user.email,
        password: hash,
      });

      await newUser.save();
    });
  }

  public validateUser(user: IUser): string[] {
    const errors: string[] = [];

    if (!user.email) {
      errors.push('Email is empty');
    }

    if (
      !user.password.match(/^[a-zA-Z0-9*.!@#$%^&(){}[\]:;<>,.?\/~_+-=|].{8,}$/)
    ) {
      errors.push('Use only letters and digits in password');
    }

    return errors;
  }

  // login = async (req: Request, res: Response) => {
  //   const emailVar = req.body.email;
  //   const passwordVar = req.body.password;

  //   this.exists(emailVar).then(async () => {
  //     const user = await User.findOne({ email: emailVar }).exec();

  //     if (user && (await bcrypt.compare(passwordVar, user.password))) {
  //       res.status(200).send('Login success!');
  //     }
  //     res.status(400).send('Invalid login');
  //   });
  // };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(process.env.SESSION_NAME);
    res.status(200);
  };
}
