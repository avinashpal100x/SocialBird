import express from 'express'
import { addNewPost, getAllPosts, getUserPosts, likePost, disLikePost, bookmarkPost, deletePost } from '../controllers/postController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'


const postRouter = express.Router();

postRouter.post("/addpost", isAuthenticated, upload.single('image'), addNewPost);
postRouter.get("/getallposts", isAuthenticated, getAllPosts);
postRouter.get("/getuserposts", isAuthenticated, getUserPosts);
postRouter.get("/:id/like", isAuthenticated, likePost);
postRouter.get("/:id/dislike", isAuthenticated, disLikePost);
postRouter.delete("/delete/:id", isAuthenticated, deletePost);
postRouter.get("/:id/bookmark", isAuthenticated, bookmarkPost);


export default postRouter;