import { Request, Response, Router } from 'express';
import UserController from '../controllers/user-controller';
import validateUser from '../middleware/validate-user';
import IUser from '../models/interfaces/IUser';
import generateToken from '../controllers/generate-token';

const user = Router();
const userController: UserController = new UserController();

user.post('/register', validateUser, async (req: Request, res: Response) => {
  const userExist: IUser = await userController.findUser(req.body.email);

  if (userExist) {
    res.status(400).json({ error: 'Email is already taken' });
  } else {
    userController.createUser(req.body).catch((error) => {
      res.status(400).json({ error: 'Invalid email or password' });
    });

    await generateToken(res, req.body.email);
    res.status(200).json({ message: 'User created' });
  }
});

user.post('/login', validateUser, userController.login);

export default user;
