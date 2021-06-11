import * as express from 'express';
import * as cors from 'cors';

require('dotenv').config();

import connectDb from './db/index';
import routes from './routes/index';

const SERVER_PORT = process.env.SERVER_PORT || 3001;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(routes);

connectDb()
  .then(() => {
    console.log('Database connection successfull');

    app.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => console.error(err));
