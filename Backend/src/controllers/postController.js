import { Post } from '../models/postModel.js'
import { User } from '../models/userModel.js'
import { Comment } from '../models/commentModel.js'
import sharp from 'sharp'
import getDataUri from '../utils/dataUri.js'
import cloudinary from '../config/cloudinary.js'
import { createNotification } from '../utils/createNotification.js'
import { getIO } from '../socket/socket.js'
import { getReceiverSocketId } from '../socket/socket.js'
import { Notification } from '../models/notificationModel.js'



// add new post
export const addNewPost = async (req, res) => {
    try {
        const authorId = req.userId;

        const { caption } = req.body;
        if (caption?.length > 2200) {
            return res.status(400).json({
                message: "Caption too long",
                success: false
            });
        }

        const media = req.file;
        if (!media) return res.status(400).json({
            message: "Media is required",
            success: false
        })

        // optimizing media
        const optimizedMedia = await sharp(media.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()

        // data sending to uri
        const fileUri = getDataUri(media, optimizedMedia);

        // cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // creating post
        const post = await Post.create({
            caption,
            media: cloudResponse.secure_url,
            author: authorId
        })

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author' });

        return res.status(201).json({
            message: "New post added",
            post,
            success: true
        })
    }
    catch (error) {
        console.error("Post Adding Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// get all posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePhoto" })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: ({
                    path: "author",
                    select: "username profilePhoto"
                })
            })

        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (error) {
        console.error("Failed to get all posts", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// get user posts
export const getUserPosts = async (req, res) => {
    try {

        const authorId = req.userId;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePhoto" })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: ({
                    path: "author",
                    select: "username profilePhoto"
                })
            })

        return res.status(200).json({
            posts,
            success: true
        })
    }
    catch (error) {
        console.error("Failed to user posts", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// like post
export const likePost = async (req, res) => {
    try {
        const authorId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        // Prevent duplicate likes
        if (post.likes.includes(authorId)) {
            return res.status(400).json({
                message: "Post already liked",
                success: false
            });
        }

        // Add like
        post.likes.push(authorId);
        await post.save();

        const io = getIO();

        // Create notification if not own post
        if (post.author.toString() !== authorId) {

            const notification = await createNotification({
                sender: authorId,
                receiver: post.author,
                type: "LIKE",
                post: post._id
            });

            // Find receiver socket
            const receiverSocketId = getReceiverSocketId(post.author.toString());

            // Send notification only to receiver
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }

        // Update likes in real-time
        io.emit("postLiked", {
            postId: post._id,
            likes: post.likes
        });

        return res.status(200).json({
            message: "Post liked",
            success: true,
            likes: post.likes
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// dislike post
export const disLikePost = async (req, res) => {
    try {
        const authorId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        post.likes = post.likes.filter(
            (id) => id.toString() !== authorId.toString()
        );

        await post.save();

        // delete notification
        const deletedNotification = await Notification.findOneAndDelete({
            sender: authorId,
            receiver: post.author,
            type: "LIKE",
            post: post._id
        });

        const io = getIO();

        const receiverSocketId = getReceiverSocketId(post.author.toString());

        if (deletedNotification && receiverSocketId) {
            io.to(receiverSocketId).emit("notificationDeleted", {
                notificationId: deletedNotification._id
            });
        }
        
        // Update dislikes in real-time
        io.emit("postDisliked", {
            postId: post._id,
            likes: post.likes
        });

        return res.status(200).json({
            message: "Post disliked",
            success: true,
            likes: post.likes
        });

    } catch (error) {
        console.error("Failed to dislike post:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// delete post
export const deletePost = async (req, res) => {
    try {
        const authorId = req.userId;

        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: "No post found",
            success: false
        })

        if (post.author.toString() !== authorId) return res.status(403).json({
            message: "Unauthorized user",
            success: false
        })

        // delete post
        await Post.findByIdAndDelete(postId)

        // remove post from user
        await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });

        // delte all coment of post
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        })
    }
    catch (error) {
        console.error("Delete post error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// bookmark post
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.userId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: "No post found",
            success: false
        })

        const user = await User.findById(authorId);
        if (!user) return res.status(404).json({
            message: "User not found",
            success: false
        })

        const isBookmarked = await user.bookmarks.includes(post._id);
        if (isBookmarked) {
            // bookmark remove
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save();
            return res.status(200).json({
                type: "unsaved",
                message: "Bookmark removed",
                success: true
            })
        }
        else {
            // add bookmark 
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save();
            return res.status(200).json({
                type: "saved",
                message: "Post bookmarked",
                success: true
            })
        }
    }
    catch (error) {
        console.error("Bookmark post error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}