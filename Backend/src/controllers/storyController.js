import { Story } from '../models/storyModel.js'
import { User } from '../models/userModel.js'
import sharp from 'sharp'
import getDataUri from '../utils/dataUri.js'
import cloudinary from '../config/cloudinary.js'


// add story
export const addStory = async (req, res) => {
    try {
        const authorId = req.userId;

        const media = req.file;
        if (!media) return res.status(400).json({
            message: "Upload image or video",
            success: false
        })

        let uploadResult;

        const isImage = media.mimetype.startsWith("image")

        if (isImage) {
            const optimizedImage = await sharp(media.buffer)
                .resize({ width: 1080, height: 1920, fit: "inside" })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer()

            const fileUri = getDataUri({
                originalname: media.originalname,
                buffer: optimizedImage
            });

            uploadResult = await cloudinary.uploader.upload(fileUri, { folder: "stories" })
        }
        else {
            const fileUri = getDataUri({ media })
            uploadResult = await cloudinary.uploader.upload(fileUri, { folder: "stories" })
        }

        const story = await Story.create({
            author: authorId,
            media: uploadResult.secure_url,
            mediaType: uploadResult.resource_type === "video" ? "video" : "image"
        })

        return res.status(201).json({
            message: "Story uploaded successfully",
            success: true,
            story
        })

    }
    catch (error) {
        console.error("Failed to upload story", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// get story
export const getStories = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({
            message: "User not found",
            success: false
        })

        const stories = await Story.find({
            author: { $in: [userId, ...user.following] }
        })
            .populate({ path: "author", select: "name profilePhoto" })
            .populate("viewers", "username profilePhoto")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            stories
        })
    }
    catch (error) {
        console.error("Failed to upload story", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// viewers of story
export const viewStory = async (req, res) => {
    try {
        const userId = req.userId;
        const storyId = req.params.id;

        const story = await Story.findById(storyId)
        if (!story) return res.status(400).json({
            message: "Story not available",
            success: false
        })

        const isAlreadyViewed = story.viewers.some(viewer => viewer.toString() === userId)
        if (!isAlreadyViewed) {
            story.viewers.push(userId);
            await story.save();
        }

        return res.status(200).json({
            success: true
        })
    }
    catch (error) {
        console.error("Failed to view story", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// delete story
export const deleteStory = async (req, res) => {
    try {
        const authorId = req.userId;
        const storyId = req.params.id;

        const story = await Story.findById(storyId);
        if (!story) return res.status(400).json({
            message: "No story found",
            success: false
        })

        if (story.author.toString() !== authorId) return res.status(403).json({
            message: "Unauthaurized user",
            success: false
        })

        // delete story
        await Story.findByIdAndDelete(storyId)

        // delete story from user
        await User.findByIdAndUpdate(authorId, { $pull: { stories: storyId } })

        return res.status(200).json({
            message: "Story deleted successfully",
            success: true
        })

    }
    catch (error) {
        console.error("Delete story error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}