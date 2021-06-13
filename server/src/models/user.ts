import { Schema, model } from 'mongoose';
import File from './file';
import IUser from './interfaces/IUser';

const userSchema = new Schema({
  email: {
    type: String,
    requeired: true,
  },
  password: {
    type: String,
    required: true,
  },
  files: [{ type: Schema.Types.ObjectId, ref: File }],
});

const User = model<IUser>('User', userSchema);

export { userSchema };

export default User;
