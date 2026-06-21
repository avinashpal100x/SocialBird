import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useParams } from 'react-router-dom'
import useGetAllNotifications from '@/hooks/useGetAllNotifications.js'
import axios from 'axios'




const ViewNotifications = () => {

    const params = useParams();
    const userId = params.id;
    useGetAllNotifications({ userId })

    const { notifications } = useSelector(store => store.notification);
    const dispatch = useDispatch();

    const getNotificationText = (type) => {
        switch (type) {
            case 'LIKE':
                return 'liked your post ❤️';
            case 'COMMENT':
                return 'commented on your post 💬';
            case 'FOLLOW':
                return 'started following you 👤';
            case 'MESSAGE':
                return 'sent you a message 📩';
            default:
                return 'interacted with you';
        }
    };

    useEffect(() => {
        const readNotification = async () => {
            try {
                const res = await axios.put("https://socialbird-hi0p.onrender.com/api/v1/notification/read", {}, { withCredentials: true })
                if (res.data.success) {
                    dispatch(markAllAsRead())
                }
            }
            catch (error) {

            }
        }
        readNotification()
    },[dispatch])

    return (
        <div className="min-h-screen bg-[#fff8f5] relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-orange-300/20 blur-[90px]" />

            <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full bg-orange-400/20 blur-[100px]" />

            <div className="max-w-2xl mx-auto px-5 py-8 relative z-10">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#ab3500]">
                        Notifications
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Stay updated with your latest activity
                    </p>
                </div>

                {!notifications || notifications.length === 0 ? (
                    <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[32px] p-10 shadow-[0_10px_30px_rgba(26,22,20,0.04)]">
                        <p className="text-gray-500 text-center">
                            No notifications yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="
                                    bg-white/70
                                    backdrop-blur-xl
                                    border
                                    border-white/50
                                    rounded-[28px]
                                    px-5
                                    py-4
                                    shadow-[0_10px_30px_rgba(26,22,20,0.04)]
                                    hover:scale-[1.01]
                                    hover:shadow-lg
                                    transition-all
                                    duration-300
                                "
                            >
                                <div className="flex items-center gap-4">

                                    <Avatar className="w-12 h-12 ring-2 ring-orange-100">
                                        <AvatarImage
                                            src={notification?.sender?.profilePhoto}
                                        />

                                        <AvatarFallback className="bg-gradient-to-br from-[#ff6b35] to-[#FFA94D] text-white font-semibold">
                                            {notification?.sender?.username?.charAt(0)?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <p className="text-[#1f1b19] leading-relaxed">
                                            <span className="font-semibold text-[#ab3500]">
                                                {notification?.sender?.username || 'Unknown User'}
                                            </span>{' '}
                                            {getNotificationText(notification?.type)}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ViewNotifications;