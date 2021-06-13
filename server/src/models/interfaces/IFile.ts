import { Document } from 'mongoose'
import IUser from './IUser';

interface IFile extends Document {
  owner: string,
  name: string,
  path: string,
  size_bytes: number,
  isDir: boolean,
  sharedWith?: Array<IUser>,
  createdAt?: number,
}

export default IFile;
