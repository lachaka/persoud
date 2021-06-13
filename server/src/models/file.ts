import { Schema, model, Types } from 'mongoose';
import User from './user';

const fileSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      requeired: true,
    },
    name: {
      type: String,
      requeired: true,
    },
    path: {
      type: String,
      requeired: true,
    },
    size_bytes: {
      type: Number,
      required: true,
      default: 0,
    },
    isDir: {
      type: Boolean,
      default: false,
    },
    sharedWith: [{ type: Types.ObjectId, ref: User }],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const File = model('File', fileSchema);

export { fileSchema };

export default File;
