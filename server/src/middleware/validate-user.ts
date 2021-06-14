import { Request, Response } from 'express';
import UserController from '../controllers/user-controller';
import IUser from '../models/interfaces/IUser';

const controller: UserController = new UserController();

const validateUser = (req: Request, res: Response, next: () => void): void => {
  const user: IUser = req.body;

  const isValidUser: string[] = controller.validateUser(user);

  if (isValidUser.length > 0) {
    res.status(400).json({ success: false, error: 'Invalid email or password' });
  } else {
    next();
  }
};

export default validateUser;
