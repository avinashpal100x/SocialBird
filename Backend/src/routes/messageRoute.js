import express from 'express'
import {sendMessage,getMessage} from '../controllers/messageController.js'
import  isAuthenticated  from '../middlewares/isAuthenticated.js'


const messageRouter = express.Router();

messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.get("/get/:id", isAuthenticated, getMessage);

export default messageRouter;