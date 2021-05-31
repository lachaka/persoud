///<reference path='context/dbContext.ts'/>
const express = require('express');
const mongoose = require('mongoose');
const app = express();
let dbContext = new dbContext();
const uri = "mongodb://localhost:27010/personalCloud";
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
app.use(express.json());
connectDB();
function connectDB() {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }, function (err) {
        createDatabase();
        createCollection();
        console.log("Database created");
    })
        .then(() => console.log("Connected to DB"));
}
//# sourceMappingURL=server.js.map