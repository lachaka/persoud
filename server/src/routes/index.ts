import { Router, Request, Response } from 'express';
import file from './file';
import user from './user';

const routes = Router();

routes.use('/files', file);
routes.use('', user);

routes.all('*', (req: Request, res: Response) => {
    res.status(404).json({ 'error': 'No resource' })
});

export default routes;
