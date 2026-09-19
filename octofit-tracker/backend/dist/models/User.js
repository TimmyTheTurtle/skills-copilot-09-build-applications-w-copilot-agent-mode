import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    avatarColor: { type: String, required: true },
    bio: { type: String, required: true },
}, { timestamps: true });
export const User = model('User', userSchema);
