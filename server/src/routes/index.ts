import * as express from 'express';
import file from './file';
import authentication from "./authentication";
import authorization from "./authorization";

const routes = express.Router();

routes.use('/files', file);
routes.use('/authentication', authentication);
routes.use('/authorization', authorization);

export default routes;