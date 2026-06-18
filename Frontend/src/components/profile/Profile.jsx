import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { MessageCircle, Heart } from 'lucide-react'
import useGetUserProfile from '@/hooks/useGetUserProfile.js'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Profile = () => {

  const params = useParams();
  const userId = params.id;
  useGetUserProfile({ userId });

  const { userProfile, user } = useSelector(store => store.auth)
  const [activeTab, setActiveTab] = useState('posts')

  const isloggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userId)

  const tabChangeHandler = async (tab) => {
    setActiveTab(tab)
  }

  const displayedPosts =
    activeTab === 'posts'
      ? userProfile?.posts || []
      : userProfile?.bookmarks || [];

  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>

      {/* profile photo and user details */}
      <div className='flex flex-col md:flex-row gap-10 items-start'>

        {/* profile photo */}
        <div className='flex justify-center md:w-1/3'>
          <Avatar className='w-40 h-40 md:w-48 md:h-48 ring-4 ring-orange-100 shadow-lg cursor-pointer'>
            <AvatarImage src={userProfile?.profilePhoto} />
            <AvatarFallback>
              {user?.username?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* user details */}
        <div className='flex-1 space-y-6'>

          <div className='space-y-5'>

            <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
              <span className='text-2xl font-semibold text-gray-800 cursor-pointer'>
                {userProfile?.username}
              </span>

              {
                isloggedInUserProfile ? (
                  <>
                    <Link to="/profile/edit">
                      <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer'>
                        Edit Profile
                      </Button>
                    </Link>

                    <Button
                      variant='secondary'
                      className='rounded-xl border-orange-200 hover:bg-gradient-to-r hover:from-[#FF6B35] hover:to-[#FFA94D] hover:text-white transition-all duration-300 cursor-pointer'
                    >
                      View Archieve
                    </Button>

                    <Button
                      variant='secondary'
                      className='rounded-xl border-orange-200 hover:bg-gradient-to-r hover:from-[#FF6B35] hover:to-[#FFA94D] hover:text-white transition-all duration-300 cursor-pointer'
                    >
                      Add Tools
                    </Button>
                  </>
                ) : (
                  isFollowing ? (
                    <>
                      <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer'>
                        Unfollow
                      </Button>

                      <Button
                        variant='secondary'
                        className='rounded-xl border-orange-200 hover:bg-gradient-to-r hover:from-[#FF6B35] hover:to-[#FFA94D] hover:text-white transition-all duration-300 cursor-pointer'
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button className='bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer'>
                      Follow
                    </Button>
                  )
                )
              }
            </div>

            <div className='flex gap-8 text-sm md:text-base'>
              <p>
                <span className='font-bold text-gray-900'>
                  {userProfile?.posts?.length || 0}
                </span>{' '}
                <span className='text-gray-600'>posts</span>
              </p>

              <p>
                <span className='font-bold text-gray-900'>
                  {userProfile?.followers?.length || 0}
                </span>{' '}
                <span className='text-gray-600'>followers</span>
              </p>

              <p>
                <span className='font-bold text-gray-900'>
                  {userProfile?.following?.length || 0}
                </span>{' '}
                <span className='text-gray-600'>following</span>
              </p>
            </div>

            <div>
              <p className='text-2xl font-semibold text-gray-800 cursor-pointer'>
                {userProfile?.name}
              </p>
              <p className='text-gray-700 leading-relaxed'>
                {userProfile?.bio}
              </p>
            </div>

            <div>

            </div>

          </div>

        </div>

      </div>

      {/* post and other */}
      <div className='mt-10 border-t border-gray-200'>

        <div className='flex items-center justify-center gap-20 py-4'>

          <span
            className={`cursor-pointer font-medium text-sm tracking-wider pb-3 transition-all duration-300 
              ${activeTab === 'posts'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-orange-500'
              }`}
            onClick={() => tabChangeHandler('posts')}
          >
            POSTS
          </span>

          <span
            className={`cursor-pointer font-medium text-sm tracking-wider pb-3 transition-all duration-300 
              ${activeTab === 'reels'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-orange-500'
              }`}
            onClick={() => tabChangeHandler('reels')}
          >
            REELS
          </span>

          <span
            className={`cursor-pointer font-medium text-sm tracking-wider pb-3 transition-all duration-300 
              ${activeTab === 'saved'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-orange-500'
              }`}
            onClick={() => tabChangeHandler('saved')}
          >
            SAVED
          </span>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {
            displayedPosts?.map((post) => {
              return (
                <div
                  key={post._id}
                  className="relative overflow-hidden rounded-xl aspect-square cursor-pointer group"
                >
                  <img
                    src={post?.media}
                    alt="image"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-8 text-white font-semibold">

                      <div className="flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-white" />
                        <span>{post?.likes?.length}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        <span>{post?.comments?.length}</span>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

      </div>

    </div>
  )
}


export default Profile