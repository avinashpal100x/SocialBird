import { User } from '../models/userModel.js'
import { formatUser } from '../utils/formatUser.js'
import getDataUri from '../utils/dataUri.js'
import cloudinary from '../config/cloudinary.js'


// get profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            });
        }

        const user = await User.findById(userId)
            .populate({
                path: "posts",
                options: {
                    sort: { createdAt: -1 }
                }
            })
            .populate({
                path: "bookmarks"
            });


        return res.status(200).json({
            user: formatUser(user),
            success: true
        })
    }
    catch (error) {
        console.error("Get Profile Error", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// edit profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, bio, gender, username } = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false })

        if (username) user.username = username;
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        if (profilePhoto) {
            const fileUri = getDataUri(profilePhoto);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user: formatUser(user)
        })

    }
    catch (error) {
        console.error("Edit Profile Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// get suggested users
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.userId } });

        return res.status(200).json({
            success: true,
            users: suggestedUsers.map(user => formatUser(user))
        })
    }
    catch (error) {
        console.error("Suggested Users Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// follow or unfollow
export const followOrUnfollow = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                message: "You can not follow yourself",
                success: false
            })
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId)
        if (!currentUser || !targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        // follow or unfollow logic
        const isFollowing = await currentUser.following.includes(targetUserId);
        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $pull: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId } })
            ])
            return res.status(200).json({
                message: `Unfollowed Successfully to ${targetUser?.name}`,
                action: "unfollowed",
                success: true
            })
        }
        else {
            // follow logic
            await Promise.all([
                User.updateOne({ _id: currentUserId }, { $addToSet: { following: targetUserId } }),
                User.updateOne({ _id: targetUserId }, { $addToSet: { followers: currentUserId } })
            ])
            return res.status(200).json({
                message: `Followed Successfully to ${targetUser?.name}`,
                action: "followed",
                success: true
            })
        }
    }
    catch (error) {
        console.error("Follow or Unfollow Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}