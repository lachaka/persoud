"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbContext = void 0;
const mongodb_1 = require("mongodb");
class dbContext {
    constructor() {
        this.mongoClient = require('mongodb').MongoClient;
        this.uri = "mongodb://localhost:27017/";
        this.databaseName = "personalCloud";
    }
    createDatabase() {
        const database = this.uri + this.databaseName;
        mongodb_1.MongoClient.connect(database, function (err, db) {
            if (err) {
                throw err;
            }
            console.log("Database created!");
            db.close();
        });
    }
    createCollection() {
        mongodb_1.MongoClient.connect(this.uri, function (err, db) {
            if (err) {
                throw err;
            }
            const dbo = db.db(this.databaseName);
            dbo.createCollection("user", function (err, res) {
                if (err) {
                    throw err;
                }
                console.log("User collection created!");
                db.close();
            });
        });
    }
}
exports.dbContext = dbContext;
/* function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function insertUser(...users) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }

        const dbo = db.db(databaseName);
        const data = [];

        for (let i = 0; i < users.length; i++) {
            const user = {
                id: generateGUID(),
                email: users[i].email,
                firstName: users[i].firstName,
                lastName: users[i].lastName
            }
        }

        dbo.collection("customers").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
} */ //
//# sourceMappingURL=dbContext.js.map