import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    requeired: true,
  },
  password: {
    type: String,
    required: true,
  },
  // files: []
});

const User = model("User", userSchema);

export { userSchema };

export default User;
