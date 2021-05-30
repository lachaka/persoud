import * as express from 'express';
import * as dotenv from 'dotenv';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`);
});