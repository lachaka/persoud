import * as mongoose from "mongoose";

const connectDb = () => {
  return mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
};

export default connectDb;
