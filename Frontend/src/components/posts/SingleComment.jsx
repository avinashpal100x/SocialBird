import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const singleComment = ({ comment }) => {
    return (
        <div className='flex items-start gap-3 py-3'>
            <Avatar className='w-11 h-11 ring-2 ring-orange-100 shadow-md flex-shrink-0'>
                <AvatarImage src={comment?.author?.profilePhoto} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
                <span className='font-semibold text-black text-sm'>
                    {comment?.author?.username}
                </span>

                <span className='text-gray-600 text-sm leading-relaxed'>
                    {comment.text}
                </span>
            </div>
        </div>
    )
}

export default singleComment
