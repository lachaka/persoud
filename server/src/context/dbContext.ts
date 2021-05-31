import {MongoClient} from "mongodb";

const databaseName = "personalCloud";

export class dbContext {

    mongoClient: MongoClient;
    uri: string;

    constructor() {
        this.mongoClient = require('mongodb').MongoClient;
        this.uri = "mongodb://localhost:27017/";
    }


    public createDatabase(): void {
        const database = this.uri + databaseName;

        MongoClient.connect(database, function (err, db) {
            if (err) {
                throw err;
            }

            const dbo = db.db(databaseName);

            dbo.createCollection("user", function (err, res) {
                if (err) {
                    throw err;
                }
                console.log("User collection created!");
            });

            db.close().then(() => console.log("Finished creation"));
        });
    }
}
