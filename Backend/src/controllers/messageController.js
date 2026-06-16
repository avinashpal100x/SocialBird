import { Conversation } from '../models/conversationModel.js'
import { Message } from '../models/messageModel.js'


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
            senderId,
            receiverId,
            message
        })

        // push in conversation
        if (newMessage) conversation.messages.push(newMessage._id);
        await conversation.save();

        return res.status(201).json({
            success: true,
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
export const getMessage = async (req,res)=>{
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;

        // check conversation
        const conversation = await Conversation.find({
            participants:{$all:[senderId,receiverId]}
        })

        // if there is no previous conversation return empty array
        if(!conversation) return res.status(200).json({
            success:true,
            messages:[]
        })

        return res.status(200).jsom({
            success:true,
            messages:conversation?.messages
        })
    } 
    catch (error) {
        
    }
}