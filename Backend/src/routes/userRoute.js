import express from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers } from '../controllers/userController.js'
import  isAuthenticated  from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'


const userRouter = express.Router();

userRouter.get("/:id/profile", isAuthenticated, getProfile);
userRouter.post("/profile/edit", isAuthenticated, upload.single("profilePhoto"), editProfile);
userRouter.get("/suggestions", isAuthenticated, getSuggestedUsers);
userRouter.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow);

export default userRouter;