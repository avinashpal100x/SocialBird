import React, { useState,useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { MessageCircleCode } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import Messages from './Messages'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addMessages,setMessages} from '@/redux/chatSlice.js'



const ChatArea = () => {

    const { selectedChatUser } = useSelector((store) => store.auth)
    const { onlineUsers } = useSelector(store => store.chat)

    const isOnline = onlineUsers?.includes(selectedChatUser?._id)

    const [message, setMessage] = useState("")
    const dispatch = useDispatch();


    const sendMessageHandler = async () => {
        try {
            if (!message.trim()) return;

            const res = await axios.post(`http://localhost:5000/api/v1/message/send/${selectedChatUser?._id}`,
                { message },
                { withCredentials: true }
            )

            if (res.data.success) {
                dispatch(addMessages(res?.data?.newMessage))
                setMessage("")
            }

        } catch (error) {
            console.log(error);
        }
    }

    const getMessageHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/message/get/${selectedChatUser?._id}`,
                { withCredentials: true }
            )
            if(res.data.success){
                dispatch(setMessages(res?.data?.messages))
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(()=>{
        if(selectedChatUser?._id){
            getMessageHandler();
        }
    },[selectedChatUser])



    return (

        <div className="h-full">

            {
                selectedChatUser ? (
                    <div
                        className="h-full bg-white/75 backdrop-blur-2xl border border-white/30 rounded-[36px] shadow-[0_20px_60px_rgba(171,53,0,0.08)] overflow-hidden flex flex-col">

                        {/* Header */}
                        <div className="px-7 py-2 border-b border-orange-100 bg-white/60 backdrop-blur-xl">

                            <div className="flex flex-col items-center justify-center">

                                {/* Avatar */}
                                <div className="relative p-[3px] rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] shadow-[0_15px_40px_rgba(255,107,53,0.25)]">

                                    <Avatar className="w-20 h-20 border-[4px] border-white">
                                        <AvatarImage src={selectedChatUser?.profilePhoto} />
                                        <AvatarFallback className="bg-[#fff8f5] text-[#ab3500] text-2xl font-bold">
                                            {selectedChatUser?.username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2px] border-white rounded-full shadow-sm" />
                                    )}

                                </div>

                                {/* Username */}
                                <div className="mt-3 flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-[#1f1b19]">{selectedChatUser?.username}</h2>
                                    <Link to={`/profile/${selectedChatUser?._id}`}>
                                        <Button
                                            className="h-9 px-5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white font-medium shadow-lg shadow-orange-200/50 hover:scale-105 hover:shadow-orange-300/50 transition-all duration-300 cursor-pointer">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>

                            </div>

                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-7 py-6 bg-linear-to-b from-[#fff8f5] via-white to-[#fff8f5]">
                            <Messages selectedChatUser={selectedChatUser} />
                        </div>

                        {/* Input */}
                        <div className="p-5 border-t border-orange-100 bg-white/60 backdrop-blur-xl">

                            <div className="flex items-center gap-3 bg-white rounded-full border border-orange-100 px-3 py-2 shadow-[0_10px_30px_rgba(255,107,53,0.08)]">

                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
                                />

                                <Button
                                    onClick={sendMessageHandler}
                                    className="h-11 px-8 rounded-full bg-linear-to-r from-[#FF6B35] to-[#FFA94D] hover:scale-105 transition-all duration-300 text-white font-semibold shadow-lg shadow-orange-200 cursor-pointer">
                                    Send
                                </Button>

                            </div>

                        </div>

                    </div>
                ) : (
                    <div
                        className="h-full bg-white/75 backdrop-blur-2xl border border-white/30 rounded-[36px] shadow-[0_20px_60px_rgba(171,53,0,0.08)] flex items-center justify-center">

                        <div className="text-center">

                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-[#FF6B35] to-[#FFA94D] flex items-center justify-center shadow-[0_20px_50px_rgba(255,107,53,0.25)]">

                                <MessageCircleCode className="w-12 h-12 text-white" />

                            </div>

                            <h2 className="text-3xl font-bold text-[#1f1b19]">
                                Select a Conversation
                            </h2>

                            <p className="text-gray-500 mt-3">
                                Choose a friend from the sidebar to start chatting
                            </p>

                        </div>

                    </div>
                )
            }

        </div>
    )
}

export default ChatArea