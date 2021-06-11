import { Document } from "mongoose";

interface IUsers extends Document {
  email: string;
  password: string;
  files?: []
}

export default IUsers;
