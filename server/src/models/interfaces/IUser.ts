import { Document } from 'mongoose';
import IFile from './IFile';

interface IUser {
  _id: string,
  email: string,
  password: string,
  files?: Set<IFile>,
}

export default IUser;
