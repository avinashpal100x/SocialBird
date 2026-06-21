import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import UploadStory from './UploadStory'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { Button } from '../ui/button'
import { setStories } from '@/redux/storySlice.js'
import { useNavigate } from 'react-router-dom'



const StoryBar = () => {

    const { user } = useSelector(store => store.auth)
    const { stories } = useSelector(store => store.story)

    const [open, setOpen] = useState(false)
    const [selectedStory, setSelectedStory] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const storyClickHandler = async (story) => {
        setSelectedStory(story)
        try {
            const res = axios.post(`https://socialbird-hi0p.onrender.com/api/v1/story/${story?._id}/view`, {}, { withCredentials: true })
        }
        catch (error) {
            console.log(error);
        }
    }

    const deleteStoryHandler = async (story) => {

        try {
            const res = await axios.delete(`https://socialbird-hi0p.onrender.com/api/v1/story/delete/${story?._id}`, { withCredentials: true })

            if (res.data.success) {

                const updatedStories = stories.filter(item => item._id !== story._id)
                dispatch(setStories(updatedStories))

                setSelectedStory(null);
                navigate("/");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

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
                        onClick={() => storyClickHandler(story)}
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

            {/* story view */}
            {
                selectedStory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">

                        {/* Close Button */}
                        <Button
                            onClick={() => setSelectedStory(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/20 cursor-pointer"
                        >
                            ✕
                        </Button>

                        {/* Story Card */}
                        <div className="relative w-full max-w-sm h-[80vh] rounded-[32px] overflow-hidden shadow-2xl bg-black">

                            <img
                                src={selectedStory?.media}
                                alt="story"
                                className="w-full h-full object-cover"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                            {/* Author Info */}
                            <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
                                <Avatar className="w-12 h-12 ring-2 ring-white">
                                    <AvatarImage src={selectedStory?.author?.profilePhoto} />
                                    <AvatarFallback>
                                        {selectedStory?.author?.username?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h3 className="text-white font-semibold text-sm">
                                        {selectedStory?.author?.name || selectedStory?.author?.username}
                                    </h3>

                                    <p className="text-white/70 text-xs">
                                        Story
                                    </p>
                                </div>
                            </div>

                            {/* viewers */}
                            {
                                selectedStory?.author?._id === user?._id && (
                                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent max-h-44 overflow-y-auto">

                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-white text-sm font-semibold">
                                                Viewed By
                                            </h4>

                                            <span className="text-white/70 text-xs bg-white/10 px-2 py-1 rounded-full">
                                                {selectedStory?.viewers?.length || 0}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {selectedStory?.viewers?.map(viewer => (
                                                <div
                                                    key={viewer._id}
                                                    className="flex items-center gap-3 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
                                                >
                                                    <Avatar className="w-9 h-9 ring-1 ring-white/30">
                                                        <AvatarImage src={viewer.profilePhoto} />
                                                        <AvatarFallback>
                                                            {viewer?.username?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <span className="text-white text-sm font-medium truncate">
                                                        {viewer.username}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )
                            }

                            {/* delete story */}
                            {selectedStory?.author?._id === user?._id && (
                                <Button
                                    onClick={() => deleteStoryHandler(selectedStory)}
                                    className="absolute top-4 right-4 z-10 h-10 px-5 rounded-2xl bg-red-500/90 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/30 shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                                    variant="destructive"
                                >
                                    Delete
                                </Button>
                            )}

                        </div>
                    </div>
                )
            }

            <UploadStory open={open} setOpen={setOpen} />


        </div>
    )
}

export default StoryBar