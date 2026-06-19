import React, { useState } from 'react';
import { Home, Search, Compass, Clapperboard, MessageCircle, Heart, PlusSquare, LogOut } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CreatePost from '../posts/CreatePost';
import { markAllAsRead } from '@/redux/notificationSlice.js'



const LeftSidebar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { user } = useSelector(store => store.auth);
  const { notifications } = useSelector(store => store.notification);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  const sidebarItems = [
    { title: "Home", icon: Home },
    { title: "Search", icon: Search },
    { title: "Explore", icon: Compass },
    { title: "Reels", icon: Clapperboard },
    { title: "Messages", icon: MessageCircle },
    { title: "Notifications", icon: Heart },
    { title: "Create", icon: PlusSquare },
    {
      title: "Profile",
      icon: () => (
        <Avatar className="w-7 h-7 ring-2 ring-orange-100">
          <AvatarImage src={user?.profilePhoto} />
          <AvatarFallback>
            {user?.username?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )
    },
    { title: "Logout", icon: LogOut }
  ];

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/auth/logout",
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Logout failed"
      );
    }
  };

  const sidebarHandler = (title) => {
    if (title === "Logout") {
      logoutHandler();
    } else if (title === "Create") {
      setOpen(true);
    } else if (title === "Profile") {
      navigate(`/profile/${user._id}`);
    } else if (title === "Home") {
      navigate("/");
    } else if (title === "Messages") {
      navigate("/chat");
    } else if (title === "Notifications") {
      navigate(`/notifications/${user._id}`);
      dispatch(markAllAsRead())
    }
  };

  return (
    <div className="w-62.5 h-screen bg-[#fff8f5] border-r border-orange-100 shadow-[0_10px_30px_rgba(26,22,20,0.04)] flex flex-col px-6 py-6 sticky top-0">

      <div className="text-3xl font-extrabold text-[#FF6B35] mb-10 tracking-tight">
        SocialBird
      </div>

      {sidebarItems.map((item, index) => (
        <div
          key={index}
          onClick={() => sidebarHandler(item.title)}
          className="flex items-center gap-4 h-14 rounded-2xl px-3 cursor-pointer transition-all duration-300 hover:bg-linear-to-r hover:from-[#FF6B35] hover:to-[#FFA94D] hover:text-white mt-2"
        >
          <div className="shrink-0">
            <item.icon size={24} />
          </div>

          <span className="text-[15px] font-medium">
            {item.title}
          </span>

          {
            item.title === "Notifications" && unreadCount > 0 && (
              <div className="ml-auto relative">

                {/* Ping Effect */}
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></span>

                {/* Badge */}
                <span className="relative flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold shadow-lg border-2 border-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>

              </div>
            )
          }

        </div>
      ))}

      <CreatePost open={open} setOpen={setOpen} />

    </div>
  );
};

export default LeftSidebar;