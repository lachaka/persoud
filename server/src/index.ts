import * as express from 'express';
import * as cors from 'cors';

require('dotenv').config();

import sequelize from './db/index';
import routes from './routes/index';
import Role from "./models/role";

const SERVER_PORT = process.env.SERVER_PORT || 3001;

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(routes);

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync({force: true}).then(() => { //{force: true} - drops database and resyncs
        initialRoles();
    });

    app.listen(SERVER_PORT, () => {
      console.log(`Server is listening on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

function initialRoles() {
    Role.create({
        id: 1,
        name: "user"
    }).then(() => {
        console.log("user role added");
    });

    Role.create({
        id: 2,
        name: "moderator"
    }).then(() => {
        console.log("moderator role added");
    });;

    Role.create({
        id: 3,
        name: "admin"
    }).then(() => {
        console.log("admin role added");
    });;
}