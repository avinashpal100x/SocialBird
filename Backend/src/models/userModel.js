import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    profilePhoto: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 200 },
    gender: { type: String, enum: ["male", "female", "other"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);