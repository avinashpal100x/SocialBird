import mongoose, { mongo } from 'mongoose'

const storySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const Story = mongoose.model('Story', storySchema)