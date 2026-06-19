import { Notification } from '../models/notificationModel.js'

export const getNotifications = async (req, res) => {
    try {

        const receiver = req.userId

        const notifications = await Notification.find({ receiver })
            .sort({ createdAt: -1 })
            .populate({ path: "sender", select: "username profilePhoto" })


res.status(200).json({
    success: true,
    notifications
});
    }
    catch (error) {
    console.error("Notifications error :", error);
    return res.status(500).json({
        message: "Internal server error",
        success: false
    })
}
};