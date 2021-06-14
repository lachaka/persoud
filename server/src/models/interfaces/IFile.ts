import { Document } from 'mongoose'
import IUser from './IUser';

interface IFile {
  _id: string,
  owner: string,
  name: string,
  path: string,
  size_bytes: number,
  isDir: boolean,
  sharedWith?: Set<IUser>,
  createdAt?: number,
}

export default IFile;
