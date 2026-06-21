import { Notification } from '../models/notificationModel.js'
import { getIO, getReceiverSocketId } from '../socket/socket.js'


export const createNotification = async ({ sender, receiver, type, post = null }) => {

    const notification = await Notification.create({
        sender,
        receiver,
        type,
        post
    })

    const receiverSocketId = getReceiverSocketId(receiver);

    if (receiverSocketId) {
        getIO()
            .to(receiverSocketId)
            .emit("newNotification", notification);

    }
    return notification;
}