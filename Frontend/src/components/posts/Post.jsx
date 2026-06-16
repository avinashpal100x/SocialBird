import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '../ui/dialog'
import { MoreHorizontal, MessageCircle, Send, Bookmark } from 'lucide-react'
import { Button } from '../ui/button'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Comments from './Comments'
import { Input } from '../ui/input'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { formatDistanceToNow } from "date-fns";
import { Badge } from '../ui/badge'



const Post = ({ post }) => {

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false)
  const [countLikes, setCountLikes] = useState(post?.likes?.length)
  const [comment, setComment] = useState(post?.comments || [])
  const dispatch = useDispatch();


  const changeTextHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    }
    else {
      setText("")
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/v1/post/delete/${post._id}`, { withCredentials: true });
      if (res.data.success) {
        const updatedPosts = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPosts))
        toast.success(res.data.message)
      }
    }
    catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }

  const likeDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like"
      const res = await axios.get(`http://localhost:5000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
      if (res.data.success) {
        const updatedLikes = liked ? countLikes - 1 : countLikes + 1
        setCountLikes(updatedLikes)
        setLiked(!liked);

        // updated liked posts
        const updatedLikedPost = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id]
            }
            : p
        );

        dispatch(setPosts(updatedLikedPost));
        toast.success(res.data.message)
      }
    }
    catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }

  const commentHandler = async () => {
    try {

      const res = await axios.post(
        `http://localhost:5000/api/v1/comment/${post._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log(res.data);

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];

        setComment(updatedCommentData);

        // updated commented posts
        const updatedCommentPost = posts.map((p) =>
          p._id === post._id
            ? {
              ...p,
              comments: updatedCommentData
            }
            : p
        );

        dispatch(setPosts(updatedCommentPost));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }


  return (

    <div className='max-w-137.5 mx-auto bg-white/70 backdrop-blur-xl border border-white/20 rounded-[28px] overflow-hidden mt-8 shadow-[0_20px_60px_rgba(255,107,53,0.12),0_8px_24px_rgba(26,22,20,0.08)] hover:shadow-[0_25px_70px_rgba(255,107,53,0.18),0_12px_30px_rgba(26,22,20,0.12)] transition-all duration-300'>


      {/* avtar and username */}
      <div className='flex items-center justify-between px-5 py-4'>

        <div className='flex items-center gap-3'>

          <Avatar className='w-11 h-11 ring-2 ring-orange-100'>
            <AvatarImage src={post?.author?.profilePhoto} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* username and posted time */}
          <div className='flex flex-col gap-0.5'>
            <h1 className='flex items-center gap-2 font-semibold text-[15px] text-[#1f1b19] leading-none'>
              {post?.author?.username}
              {user._id === post.author._id && (
                <Badge className='h-5 px-2 text-[10px] rounded-full bg-orange-100 text-orange-700 border border-orange-200 shadow-sm'>
                  Author
                </Badge>
              )}
            </h1>
            <span className='text-xs text-gray-500 font-medium tracking-wide'>
              {formatDistanceToNow(new Date(post?.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

        </div>

        <Dialog>
          <DialogTrigger>
            <div className='w-9 h-9 rounded-full hover:bg-orange-50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md'>
              <MoreHorizontal className='cursor-pointer text-gray-600 w-5 h-5 transition-colors duration-300 hover:text-[#ff6b35]' />
            </div>
          </DialogTrigger>

          <DialogContent
            className='w-113.75 max-w-[95vw] border border-white/30 rounded-4xl bg-white/75 backdrop-blur-2xl p-8 shadow-[0_25px_90px_rgba(26,22,20,0.14)] overflow-hidden'>

            {/* useless four lines */}
            <DialogHeader className='hidden'>
              <DialogTitle>Create Post</DialogTitle>
              <DialogDescription>Share your thoughts with everyone.</DialogDescription>
            </DialogHeader>

            {/* background glow */}
            <div className='absolute -top-17.5 -right-17.5 w-44 h-44 bg-orange-300/30 rounded-full blur-3xl'></div>

            <div className='absolute -bottom-15 -left-15 w-36 h-36 bg-[#FFA94D]/20 rounded-full blur-3xl'></div>

            <div className='relative z-10 flex flex-col gap-5'>

              {/* unfollow */}
              <Button className='h-14 rounded-2xl bg-linear-to-r from-[#ff6b35] via-[#ff874f] to-[#FFA94D] hover:brightness-105 text-white text-[15px] font-semibold tracking-[0.2px] shadow-[0_10px_30px_rgba(255,107,53,0.28)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer border border-white/20'>
                Unfollow
              </Button>

              {/* bookmark */}
              <Button
                variant="outline"
                className='h-14 rounded-2xl border-orange-200/70 bg-white/80 hover:bg-orange-50 text-[#ab3500] text-[15px] font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md'
              >
                Bookmark
              </Button>

              {/* delete */}
              {
                user && user._id === post?.author?._id && (
                  <Button
                    onClick={deletePostHandler}
                    variant="ghost"
                    className='h-12 rounded-2xl hover:bg-gray-100/80 text-gray-500 hover:text-gray-700 text-sm font-medium transition-all duration-300 cursor-pointer'
                  >
                    Delete
                  </Button>
                )
              }
            </div>
          </DialogContent>
        </Dialog>
      </div>


      {/* image */}
      <div className='px-5 pb-5 flex justify-center'>
        <img
          src={post?.media}
          alt="beauty_pic"
          className='w-full max-w-117.5 h-87.5 object-cover rounded-3xl'
        />
      </div>


      {/* comments and others */}
      <div className='px-5 pb-4 space-y-3'>

        {/* icons */}
        <div className='flex items-center justify-between border-b border-orange-50 pb-1'>

          <div className='flex items-center gap-5 text-[22px]'>

            {
              liked ?
                <FaHeart
                  onClick={likeDislikeHandler}
                  className='cursor-pointer text-red-500 hover:text-red-600 hover:scale-125 active:scale-90 transition-all duration-300 ease-in-out drop-shadow-sm'
                />
                :
                <FaRegHeart
                  onClick={likeDislikeHandler}
                  className='cursor-pointer text-gray-700 hover:text-red-500 hover:scale-125 active:scale-90 transition-all duration-300 ease-in-out'
                />
            }

            <MessageCircle
              onClick={() => {
                setOpen(true)
                dispatch(setSelectedPost(post))
              }}
              className='cursor-pointer text-gray-700 hover:text-orange-500 hover:scale-110 active:scale-95 transition-all duration-300 ease-out' />

            <Send className='cursor-pointer text-gray-700 hover:text-blue-500 hover:scale-110 active:scale-95 transition-all duration-300 ease-out' />

          </div>

          <div>
            <Bookmark className='cursor-pointer text-gray-700 hover:text-[#ff6b35] hover:scale-110 active:scale-95 transition-all duration-300 ease-out' />
          </div>

        </div>

        {/* likes and caption */}
        <div className='space-y-1'>

          <span className='font-semibold text-[14px] tracking-tight text-[#1f1b19] block'>
            {countLikes} likes
          </span>

          <p className='text-[14px] text-gray-700 leading-normal'>

            <span className='font-semibold text-[#1f1b19] mr-2'>
              {post?.author?.username}
            </span>

            {post?.caption}

          </p>

        </div>

        {/* comment vew */}
        <div className='text-gray-500 text-sm hover:text-[#ff6b35] transition duration-300 cursor-pointer w-fit'>

          <div className='flex items-center gap-2'>
            <Comments
              open={open}
              setOpen={setOpen}
              className='w-4 h-4 shrink-0'
            />
          </div>

          <span
            onClick={() => {
              setOpen(true)
              dispatch(setSelectedPost(post))
            }}
            className='block mt-1'
          >
            View all {comment?.length || 0} comments
          </span>

        </div>

        {/* comment input */}
        <div className='flex items-center gap-3 bg-linear-to-r from-[#fff8f5] to-[#fffdfc] border border-orange-100 rounded-2xl px-4 py-2.5 shadow-sm hover:border-orange-200 focus-within:border-orange-300 focus-within:shadow-[0_0_0_4px_rgba(255,107,53,0.08)] transition-all duration-300'>

          <div className='flex items-center justify-between w-full gap-3'>

            <Input
              type="text"
              placeholder="Comment here....."
              value={text}
              onChange={changeTextHandler}
              className='border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[14px] text-[#1f1b19] placeholder:text-gray-400 p-0'
            />

            {
              text && (
                <Button
                  onClick={commentHandler}
                  className='text-[#ff6b35] font-semibold text-sm cursor-pointer hover:text-[#e85d2c] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap'>
                  Post
                </Button>
              )
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default Post