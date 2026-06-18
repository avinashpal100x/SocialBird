import mongoose, { mongo } from 'mongoose'

const notificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LIKE', 'COMMENT', 'FOLLOW', 'MESSAGE'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    isRead: { type: Boolean, default: false }
})

export const Notification = mongoose.model("Notification", notificationSchema)