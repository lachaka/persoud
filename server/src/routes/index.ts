import * as express from 'express';
import file from './file';

const routes = express.Router();

routes.use('/files', file);


export default routes;