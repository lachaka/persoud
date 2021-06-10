import * as express from 'express';
import file from '/file';
import user from './user';

const routes = express.Router();

routes.use('/files', file);
routes.use('/user', user);

export default routes;
