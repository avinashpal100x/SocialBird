import { Post } from '../models/postModel.js'
import { Comment } from '../models/commentModel.js'
import { createNotification } from '../utils/createNotification.js'
import { getIO } from '../socket/socket.js'
import { getReceiverSocketId } from '../socket/socket.js'



// add comment
export const addComment = async (req, res) => {
    try {
        const authorId = req.userId;

        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: "Post not found",
            success: false
        })

        const { text } = req.body;
        if (!text || text.trim() === "") return res.status(400).json({
            message: "Text is required",
            success: false
        })

        const comment = await Comment.create({
            text,
            post: postId,
            author: authorId
        })

        await comment.populate({
            path: "author",
            select: "username profilePhoto"
        })

        post.comments.push(comment._id);
        await post.save();

        const io = getIO();

        // Create notification if not own post
        if (post.author.toString() !== authorId) {

            const notification = await createNotification({
                sender: authorId,
                receiver: post.author,
                type: "COMMENT",
                post: post._id
            });

            // Find receiver socket
            const receiverSocketId = getReceiverSocketId(post.author.toString());

            // Send notification only to receiver
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }

        // Emit socket event to all connected clients
        io.emit("newComment", {
            postId,
            comment
        });


        return res.status(201).json({
            message: "Comment added",
            success: true,
            comment
        })
    }
    catch (error) {
        console.error("Add comment error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// get comments of post
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId })
            .populate({
                path: 'author',
                select: "username profilePhoto"
            })
            .sort({ createdAt: -1 })

        return res.status(200).json({
            comments,
            success: true
        })
    }
    catch (error) {
        console.error("Get comment error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}