import { Schema, model, Types, Document, Model } from 'mongoose';
import IFile from './interfaces/IFile';

export interface FileDocument extends IFile, Document {
  _id: string
}

export interface FileModel extends Model<FileDocument> {

}

const fileSchema = new Schema<FileDocument, FileModel>({
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
    sharedWith: [{ type: Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const File = model<FileDocument>('File', fileSchema);

