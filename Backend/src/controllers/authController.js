import { User } from '../models/userModel.js'
import { Post } from '../models/postModel.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../config/token.js'
import { formatUser } from '../utils/formatUser.js'



// register user
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(422).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await User.findOne({ $or: [{ username }, { email }] })
        if (user?.username === username) {
            return res.status(400).json({
                message: "username already exist",
                success: false
            })
        }
        if (user?.email === email) {
            return res.status(400).json({
                message: "email already exist",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        const token = await generateToken(newUser._id);

        // all post appear on home page
        const homePosts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profilePhoto"
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profilePhoto"
                }
            })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

        return res.status(201).json({
            message: "Account created Successfully",
            success: true,
            user: formatUser(newUser),
            homePosts
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await User.findOne({ username }).select("+password")
        if (!user) return res.status(400).json({
            message: "User not exist",
            success: false
        })

        const isPasswordMatch = await bcrypt.compare(password, user?.password);
        if (!isPasswordMatch) return res.status(400).json({
            message: "Incorrect Password",
            success: false
        })

        const token = await generateToken(user._id);

        // all post appear on home page
        const homePosts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "author",
                select: "username profilePhoto"
            })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profilePhoto"
                }
            })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

        return res.status(200).json({
            message: `Welcome Back ${user?.name}`,
            success: true,
            user: formatUser(user),
            homePosts
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

// logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })

        return res.status(200).json({
            message: "Logged Out Successfully",
            success: true
        })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}