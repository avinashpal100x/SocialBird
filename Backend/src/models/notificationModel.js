import mongoose, { mongo } from 'mongoose'

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LIKE', 'COMMENT', 'FOLLOW', 'MESSAGE'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true })

export const Notification = mongoose.model("Notification", notificationSchema)