import * as express from 'express';
import * as cors from 'cors';

require('dotenv').config();

import sequelize from './db/index';
import routes from './routes/index';

const SERVER_PORT = process.env.SERVER_PORT || 3001;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(routes);

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();

    app.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
