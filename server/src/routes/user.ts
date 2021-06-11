import { Request, Response, Router } from 'express';
import UserController from '../controllers/user-controller';
import validateUser from '../middleware/validate-user';

const user = Router();
const controller = new UserController();

user.post('/register', validateUser, async (req: Request, res: Response) => {
  const userExist = await controller.findUser(req.body.email);

  if (userExist) {
    res.status(400).json({ error: 'Email is already taken' });
  } else {
    controller.createUser(req.body).catch((error) => {
        res.status(400).json({ error: 'Invalid email or password' });
      });
    res.status(200).json({ message: 'User created' });
  }
});

// user.post('/login', controller.login);

user.post('/logout', controller.logout);

export default user;
