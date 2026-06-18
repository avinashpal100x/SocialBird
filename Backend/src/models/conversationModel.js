import mongoose, { mongo } from 'mongoose'

const conversationSchema = new mongoose.Schema({

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

}, { timestamps: true })

export const Conversation = mongoose.model('Conversation', conversationSchema)