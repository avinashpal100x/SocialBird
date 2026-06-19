import { Conversation } from '../models/conversationModel.js'
import { Message } from '../models/messageModel.js'
import { getIO, getReceiverSocketId } from '../socket/socket.js'
import { SOCKET_EVENTS } from '../socket/socketEvents.js'



// send message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        const { message } = req.body;

        // validation message
        if (!message.trim()) return res.status(400).json({
            message: "Message required",
            success: false
        })

        // check conversation exist or not
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        // create conversation
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        // new message
        const newMessage = await Message.create({
            conversationId: conversation._id,
            senderId,
            receiverId,
            message
        })

        const receieverSocketId = getReceiverSocketId(receiverId);
        if (receieverSocketId) {
            const io = getIO();
            io.to(receieverSocketId)
                .emit(SOCKET_EVENTS.RECEIVE_MESSAGE, newMessage)
        }

        return res.status(201).json({
            success: true,
            message: "Message Sent",
            newMessage
        })
    }
    catch (error) {
        console.error("Send message error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// get message
export const getMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;

        // check conversation
        const conversation = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        })

        // if there is no previous conversation return empty array
        if (!conversation) return res.status(200).json({
            success: true,
            messages: []
        })

        return res.status(200).jsom({
            success: true,
            messages: conversation?.messages
        })
    }
    catch (error) {

    }
}