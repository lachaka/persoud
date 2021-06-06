import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        requeired: true
    },
    password: {
        type: String,
        required: true
    },
    files: [{
        name: String,
        path: String,
        size: Number,
        isDir: Boolean,
        upload: Date
    }],
    sharedFiles: [{
        name: String,
        path: String,
        size: Number,
        isDir: Boolean,
        upload: Date
    }]
});

const User = model('User', userSchema);

export { userSchema };

export default User;