import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'
import { addStory, getStories, deleteStory, viewStory } from '../controllers/storyController.js'


const storyRouter = express.Router();

storyRouter.post("/addstory", isAuthenticated, upload.single("media"), addStory)
storyRouter.get("/getstories", isAuthenticated, getStories)
storyRouter.post("/:id/view", isAuthenticated, viewStory)
storyRouter.delete("/delete/:id", isAuthenticated, deleteStory)

export default storyRouter;