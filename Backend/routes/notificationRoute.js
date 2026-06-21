import express from 'express'
import { getNotifications ,markNotificationAsRead} from '../controllers/notificationController.js'
import  isAuthenticated  from '../middlewares/isAuthenticated.js'


const notificationRouter = express.Router();

notificationRouter.get("/getnotifications/:id", isAuthenticated, getNotifications);
notificationRouter.put("/read", isAuthenticated, markNotificationAsRead);

export default notificationRouter;