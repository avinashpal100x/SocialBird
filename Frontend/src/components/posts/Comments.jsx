import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import SingleComment from './SingleComment'
import { setPosts } from '@/redux/postSlice'



const Comments = ({ open, setOpen }) => {

    const [text, setText] = useState("")
    const { selectedPost, posts } = useSelector(store => store.post)
    const [comment, setComment] = useState(selectedPost?.comments || [])
    const dispatch = useDispatch()

    const changeTextHandler = (e) => {
        const inputText = e.target.value

        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText("")
        }
    }

    const commentHandler = async () => {

        try {

            const res = await axios.post(
                `https://socialbird-hi0p.onrender.com/api/v1/comment/${selectedPost._id}/comment`,
                { text },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )

            if (res.data.success) {

                const updatedCommentData = [
                    ...comment,
                    res.data.comment
                ]

                setComment(updatedCommentData)

                const updatedCommentPost = posts.map((p) =>
                    p._id === selectedPost._id
                        ? {
                            ...p,
                            comments: updatedCommentData
                        }
                        : p
                )

                dispatch(setPosts(updatedCommentPost))
                toast.success(res.data.message)
                setText("")
            }

        } catch (error) {

            toast.error(
                error?.response?.data?.message || "Something went wrong"
            )
        }
    }

    useEffect(() => {

        if (selectedPost) {
            setComment(selectedPost?.comments)
        }

    }, [selectedPost])

    
    return (

        <div className='h-1/2'>

            <Dialog open={open}>

                <DialogContent
                    onInteractOutside={() => setOpen(false)}
                    className='max-w-5xl h-[76vh] p-0 overflow-hidden border border-white/20 bg-white/75 backdrop-blur-3xl rounded-[30px] shadow-[0_25px_90px_rgba(0,0,0,0.15)]'
                >

                    <DialogHeader className='hidden'>

                        <DialogTitle>
                            Create Post
                        </DialogTitle>

                        <DialogDescription>
                            Share your thoughts with everyone.
                        </DialogDescription>

                    </DialogHeader>

                    <div className='grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden'>

                        {/* LEFT IMAGE */}
                        <div className='hidden lg:flex relative bg-gradient-to-br from-[#fff5ef] via-[#fffaf8] to-[#fff2ea] items-center justify-center p-3 overflow-hidden'>

                            <div className='absolute top-10 left-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl'></div>

                            <div className='absolute bottom-10 right-10 w-72 h-72 bg-orange-100/20 rounded-full blur-3xl'></div>

                            <img
                                src={selectedPost?.media}
                                alt="post"
                                className='relative z-10 w-full h-full object-cover rounded-[22px] shadow-[0_15px_50px_rgba(0,0,0,0.12)]'
                            />

                        </div>

                        {/* RIGHT SECTION */}
                        <div className='relative bg-white/50 backdrop-blur-3xl px-5 py-4 flex flex-col h-full overflow-hidden'>

                            <div className='absolute -top-20 right-0 w-60 h-60 bg-orange-100/20 blur-3xl rounded-full'></div>

                            <div className='relative z-10 flex flex-col h-full'>

                                {/* USER INFO */}
                                <div className='flex items-center justify-between border-b border-orange-100/80 pb-4'>

                                    <div className='flex items-center gap-3'>

                                        <Link>

                                            <Avatar className='w-10 h-10 ring-2 ring-orange-100 shadow-md'>

                                                <AvatarImage
                                                    src={selectedPost?.author?.profilePhoto}
                                                />

                                                <AvatarFallback>
                                                    CN
                                                </AvatarFallback>

                                            </Avatar>

                                        </Link>

                                        <div>

                                            <Link>
                                                <h1 className='font-semibold text-[14px] tracking-tight text-[#181818] hover:text-[#ff6b35] transition-all duration-300'>
                                                    {selectedPost?.author?.username}
                                                </h1>
                                            </Link>

                                            <span className='text-[12px] text-gray-500 line-clamp-1'>
                                                {selectedPost?.author?.bio}
                                            </span>

                                        </div>

                                    </div>

                                    {/* MORE */}
                                    <Dialog>

                                        <DialogTrigger>

                                            <div className='w-8 h-8 rounded-full hover:bg-orange-50 flex items-center justify-center transition-all duration-300 cursor-pointer'>

                                                <MoreHorizontal className='w-5 h-5 text-gray-600 hover:text-[#ff6b35]' />

                                            </div>

                                        </DialogTrigger>

                                        <DialogContent className='w-[420px] max-w-[94vw] border border-white/30 rounded-[28px] bg-white/75 backdrop-blur-3xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.14)] overflow-hidden'>

                                            <div className='absolute -top-20 -right-20 w-52 h-52 bg-orange-300/20 rounded-full blur-3xl'></div>

                                            <div className='relative z-10 flex flex-col gap-3'>

                                                <Button className='h-12 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff874f] hover:brightness-110 text-white font-semibold shadow-md transition-all duration-300'>
                                                    Unfollow
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    className='h-12 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 text-[#ff6b35] font-semibold transition-all duration-300'
                                                >
                                                    Bookmark
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    className='h-10 rounded-xl text-gray-500 hover:bg-gray-100'
                                                >
                                                    Delete
                                                </Button>

                                            </div>

                                        </DialogContent>

                                    </Dialog>

                                </div>

                                {/* COMMENTS */}
                                <div className='mt-4 flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent pb-4'>

                                    {
                                        comment.map((comment) => (
                                            <SingleComment
                                                key={comment._id}
                                                comment={comment}
                                            />
                                        ))
                                    }

                                </div>

                                {/* INPUT */}
                                <div className='mt-auto pt-2'>

                                    <div className='flex items-center gap-3 bg-white/95 backdrop-blur-2xl border border-orange-100 rounded-[18px] px-4 py-2.5 shadow-[0_5px_20px_rgba(0,0,0,0.04)] focus-within:border-orange-300 transition-all duration-300'>

                                        <Input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={text}
                                            onChange={changeTextHandler}
                                            className='border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] text-[#1f1b19] placeholder:text-gray-400 p-0'
                                        />

                                        {
                                            text && (

                                                <Button
                                                    onClick={commentHandler}
                                                    className='bg-gradient-to-r from-[#ff6b35] to-[#ff874f] hover:brightness-110 text-white rounded-lg px-4 h-9 shadow-sm transition-all duration-300'
                                                >
                                                    Post
                                                </Button>

                                            )
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </DialogContent>

            </Dialog>

        </div>
    )
}

export default Comments