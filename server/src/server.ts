///<reference path='context/dbContext.ts'/>

import {dbContext} from "./context/dbContext";

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const context = new dbContext();

const uri = "mongodb://localhost:27010/personalCloud"

app.use(express.json());

connectDB().then(() => console.log("Successfully set up!"));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});



//METHODS
async function connectDB() {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
        .then(() => console.log("Connected to DB"))
        .catch(() => {
            context.createDatabase();
        });
}




