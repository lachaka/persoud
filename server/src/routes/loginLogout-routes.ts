import * as express from 'express';
import LoginLogoutClass from '../controllers/loginLogout-controller';

const user = express.Router();
const controller = new LoginLogoutClass();

user.post('/register', controller.register);

user.post('/login', controller.login);

user.post('/logout', controller.logout);

export default user;
