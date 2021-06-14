import { Schema, model, Model, Document } from 'mongoose';
import IUser from './interfaces/IUser';

export interface UserDocument extends IUser, Document {
  _id: string
}

export interface UserModel extends Model<UserDocument, UserModel> {

}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    requeired: true,
  },
  password: {
    type: String,
    required: true,
  },
  files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
});

export const User = model<UserDocument>('User', userSchema);
