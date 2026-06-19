import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {

  const { user } = useSelector(store => store.auth)
  
  if(!user) return null;

  return (
    <div className='sticky top-5 self-start w-[360px]'>

      {/* user profile */}
      <div className='flex items-start gap-4 px-5 py-4 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer mr-3'>

        <Link to={`/profile/${user?._id}`}>
          <Avatar className='w-12 h-12 ring-2 ring-orange-200 shadow-sm flex-shrink-0'>
            <AvatarImage src={user?.profilePhoto} />
            <AvatarFallback className='bg-orange-100 text-orange-700 font-semibold'>
              CN
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* username and bio */}
        <div className='flex flex-col gap-1 min-w-0'>
          <h1 className='flex items-center gap-2 font-semibold text-[16px] text-[#1f1b19] leading-none break-words'>
            <Link to={`/profile/${user._id}`}>
              {user?.username}
            </Link>
          </h1>

          <span className='text-[13px] text-gray-500 font-medium tracking-wide leading-relaxed break-words'>
            {user?.bio}
          </span>
        </div>
      </div>

      <div className='mt-5 mr-3'>
        <SuggestedUsers />
      </div>

    </div>
  )
}

export default RightSidebar