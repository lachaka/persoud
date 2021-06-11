import { Schema, model } from 'mongoose';
import File from './file';

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

const User = model('User', userSchema);

export { userSchema };

export default User;
