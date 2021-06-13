import { Document } from 'mongoose';
import IFile from './IFile';

interface IUser extends Document {
  email: string,
  password: string,
  files?: Array<IFile>,
}

export default IUser;
