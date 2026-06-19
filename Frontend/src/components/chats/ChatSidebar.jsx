import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { setSelectedChatUser } from '@/redux/authSlice.js'
import ChatArea from './ChatArea'
import { setOnlineUsers } from '@/redux/chatSlice.js'



const ChatSidebar = () => {

    const { user, suggestedUsers } = useSelector((store) => store.auth)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setSelectedChatUser(null))
    }, [dispatch])

    const { onlineUsers } = useSelector(store => store.chat)


    return (
        <div className="h-screen bg-[#fff8f5] overflow-hidden relative">

            {/* Background Effects */}
            <div className="absolute -top-30 -left-30 w-[320px] h-80 bg-orange-300/20 rounded-full blur-[120px]" />

            <div className="absolute -bottom-37.5 -right-37.5 w-95 h-95 bg-orange-400/20 rounded-full blur-[140px]" />

            <div className="flex h-full">

                {/* Sidebar */}
                <div className="w-97.5 p-3">

                    <div className="h-full bg-white/75 backdrop-blur-2xl border border-white/30 rounded-[36px] shadow-[0_20px_60px_rgba(171,53,0,0.08)] overflow-hidden flex flex-col">

                        {/* Profile */}
                        <div className="p-8 border-b border-orange-100 bg-white/60 backdrop-blur-xl">

                            <div className="flex flex-col items-center text-center">

                                {/* Avatar */}
                                <div className="relative p-[3px] rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] shadow-[0_15px_40px_rgba(255,107,53,0.25)]">

                                    <Avatar className="w-24 h-24 border-[4px] border-white">

                                        <AvatarImage src={user?.profilePhoto} />

                                        <AvatarFallback className="bg-[#fff8f5] text-[#ab3500] text-2xl font-bold">
                                            {user?.username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>

                                    </Avatar>

                                </div>

                                {/* Username */}
                                <h3 className="mt-2 text-xl font-bold text-[#1f1b19]">
                                    {user?.username}
                                </h3>

                                {/* Bio */}
                                <p className="mt-0.5 text-sm text-gray-500 max-w-[220px] leading-relaxed">
                                    {user?.bio || "Welcome to VibrantSocial"}
                                </p>

                            </div>

                        </div>


                        {/* Users */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">

                            {
                                suggestedUsers?.map((user) => {

                                    const isOnline = onlineUsers?.includes(user?._id)

                                    return (

                                        < div
                                            key={user?._id}
                                            onClick={() => dispatch(setSelectedChatUser(user))}
                                            className="group flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 hover:bg-orange-50 hover:shadow-md hover:-translate-y-1"
                                        >

                                            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] shadow-[0_10px_25px_rgba(255,107,53,0.20)]">

                                                <Avatar className="w-12 h-12 border-2 border-white">
                                                    <AvatarImage src={user?.profilePhoto} />
                                                    <AvatarFallback className="bg-[#fff8f5] text-[#ab3500] font-semibold">
                                                        {user?.username?.charAt(0)?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                {isOnline && (
                                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2px] border-white rounded-full shadow-sm" />
                                                )}

                                            </div>

                                            <div>

                                                <h4 className="font-semibold text-[#1f1b19] group-hover:text-[#ab3500] transition">
                                                    {user?.username}
                                                </h4>

                                                <p className="text-xs text-gray-400">
                                                    {isOnline ? 'Online' : 'Offline'}
                                                </p>

                                            </div>

                                        </div>
                                    )
                                })}

                        </div>

                    </div>

                </div>

                {/* Chat Section */}
                <div className="flex-1 p-5">
                    <ChatArea />
                </div>

            </div>

        </div >
    )
}

export default ChatSidebar