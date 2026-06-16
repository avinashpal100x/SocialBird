import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { addComment, getCommentsOfPost } from '../controllers/commentController.js'


const commentRouter = express.Router();

commentRouter.post("/:id/comment", isAuthenticated, addComment);
commentRouter.get("/:id/all/comments", isAuthenticated, getCommentsOfPost)

export default commentRouter;