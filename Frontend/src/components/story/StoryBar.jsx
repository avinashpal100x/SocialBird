import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import UploadStory from './UploadStory'
import { useSelector } from 'react-redux'



const StoryBar = () => {
    const { user } = useSelector(store => store.auth)
    const { stories } = useSelector(store => store.story)

    const [open, setOpen] = useState(false)

    return (
        <div className="w-full">
            <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">

                {/* Add Story */}
                <div
                    onClick={() => setOpen(true)}
                    className="relative w-[130px] h-[180px] flex-shrink-0 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md border border-orange-100 shadow-sm flex flex-col items-center justify-center hover:-translate-y-1 transition-all cursor-pointer"
                >
                    <Avatar className="w-14 h-14 ring-2 ring-orange-400">
                        <AvatarImage src={user?.profilePhoto} />
                        <AvatarFallback>
                            {user?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <span className="mt-3 text-sm font-medium text-gray-700 text-center px-2 truncate w-full">
                        {user?.name}
                    </span>

                    <span className="mt-2 w-7 h-7 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#FFA94D] text-white flex items-center justify-center text-lg font-bold shadow-lg">
                        +
                    </span>
                </div>

                {/* Stories */}
                {stories?.map((story) => (
                    <div
                        key={story?._id}
                        className="relative w-[130px] h-[180px] flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:-translate-y-1 transition-all"
                    >
                        {/* Background Image */}
                        <img
                            src={story?.media}
                            alt="story"
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                        {/* Avatar */}
                        <Avatar className="absolute top-3 left-3 w-10 h-10 ring-2 ring-white z-10">
                            <AvatarImage src={story?.author?.profilePhoto} />
                            <AvatarFallback>
                                {story?.author?.username?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Username */}
                        <span className="absolute bottom-3 left-3 text-white text-sm font-semibold text-center truncate z-10">
                            {story?.author?.name || story?.author?.username}
                        </span>
                    </div>
                ))}
            </div>

            <UploadStory open={open} setOpen={setOpen} />

            
        </div>
    )
}

export default StoryBar