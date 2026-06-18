import React, { useState } from 'react'
import { Home, Search, Compass, Clapperboard, MessageCircle, Heart, PlusSquare, LogOut } from "lucide-react";
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '@/redux/store.js'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import CreatePost from '../posts/CreatePost'




const LeftSidebar = () => {

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
        <Avatar className='w-7 h-7 ring-2 ring-orange-100'>
          <AvatarImage src={user?.profilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )
    },
    { title: "Logout", icon: LogOut }
  ];


  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth);


  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/auth/logout",
        { withCredentials: true }
      )

      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message)
      }

    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const sidebarHandler = (title) => {
    if (title === 'Logout') {
      logoutHandler()
    }
    else if (title === 'Create') {
      setOpen(true)
    }
    else if (title === 'Profile') {
      navigate(`/profile/${user._id}`)
    }
    else if (title === 'Home') {
      navigate(`/`)
    }
    else if(title == 'Messages'){
      navigate(`/chat`)
    }
  }



  return (
    <div className='w-62.5 h-screen bg-[#fff8f5] border-r border-orange-100 shadow-[0_10px_30px_rgba(26,22,20,0.04)] flex flex-col px-6 py-6 sticky top-0'>

      {/* Logo */}
      <div className='text-3xl font-extrabold text-[#FF6B35] mb-10 tracking-tight'>
        SocialBird
      </div>

      {/* Sidebar Items */}
      {
        sidebarItems.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.title)}
              className='flex items-center gap-4 h-14 rounded-2xl px-3 cursor-pointer transition-all duration-300 hover:bg-linear-to-r hover:from-[#FF6B35] hover:to-[#FFA94D] hover:text-white mt-2'
            >

              <item.icon
                size={24}
                className='transition-all duration-300 shrink-0'
              />

              <span className='text-[15px] font-medium'>
                {item.title}
              </span>

            </div>
          )
        })
      }

      {/* create post  */}
      <CreatePost open={open} setOpen={setOpen} />

    </div>
  )
}

export default LeftSidebar