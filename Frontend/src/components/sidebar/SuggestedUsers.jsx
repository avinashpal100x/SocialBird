import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const SuggestedUsers = () => {

    const { suggestedUsers, user } = useSelector(
        store => store.auth
    );

    const dispatch = useDispatch();

    const handleFollowOrUnfollow = async (suggestedUserId) => {
        try {

            const res = await axios.post(`http://localhost:5000/api/v1/user/followorunfollow/${suggestedUserId}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {

                let updatedFollowing;

                const isFollowing = user?.following?.includes(suggestedUserId);

                if (isFollowing) {
                    // Unfollow
                    updatedFollowing = user.following.filter(id => id !== suggestedUserId);
                } else {
                    // Follow
                    updatedFollowing = [...user.following, suggestedUserId];
                }

                dispatch(
                    setAuthUser({
                        ...user,
                        following: updatedFollowing
                    })
                );

                toast.success(res.data.message);
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <div className='mt-5 px-5 py-4 rounded-2xl bg-white border border-orange-100 shadow-sm'>

            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-semibold text-[#1f1b19]'>
                    Suggestions for you
                </h1>

                <span className='text-sm font-medium text-orange-500 cursor-pointer hover:text-orange-600 transition-colors'>
                    See All
                </span>
            </div>

            {
                suggestedUsers?.map((suggestedUser) => {

                    const isFollowing =
                        user?.following?.includes(suggestedUser?._id);

                    return (
                        <div
                            key={suggestedUser?._id}
                            className='flex items-center gap-3 mb-5 last:mb-0'
                        >

                            <Link to={`/profile/${suggestedUser?._id}`}>
                                <Avatar className='w-12 h-12 ring-2 ring-orange-200 shadow-sm flex-shrink-0'>
                                    <AvatarImage src={suggestedUser?.profilePhoto} />
                                    <AvatarFallback className='bg-orange-100 text-orange-700 font-semibold'>
                                        {suggestedUser?.username?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div className='flex flex-col justify-center min-w-0 flex-1'>
                                <h1 className='font-semibold text-[15px] text-[#1f1b19] leading-tight truncate'>
                                    <Link to={`/profile/${suggestedUser?._id}`}>
                                        {suggestedUser?.username}
                                    </Link>
                                </h1>

                                <span className='text-[13px] text-gray-500 leading-tight truncate'>
                                    {suggestedUser?.bio}
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    handleFollowOrUnfollow(
                                        suggestedUser?._id
                                    )
                                }
                                className='px-4 py-1.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap'
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>

                        </div>
                    );
                })
            }

        </div>
    );
};

export default SuggestedUsers;