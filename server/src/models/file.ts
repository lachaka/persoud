import { Schema, model } from "mongoose";
import User from "./user";

const fileSchema = new Schema(
  {
    owner: {
      type: String,
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
    },
    isDir: {
      type: Boolean,
    },
    upload_time: {
      type: Date,
      required: true,
    },
    sharedWith: [User],
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

const File = model("File", fileSchema);

export { fileSchema };

export default File;
