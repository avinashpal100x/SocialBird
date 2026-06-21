import React from 'react'
import Feed from '../components/posts/Feed'
import RightSidebar from '../components/sidebar/RightSidebar'
import useGetAllPosts from '../hooks/useGetAllPosts.js'
import useGetAllSuggestedUsers from '../hooks/useGetAllSuggestedUsers.js'
import useGetAllStories from '../hooks/useGetAllStories.js'


const HomePage = () => {

  useGetAllPosts();
  useGetAllSuggestedUsers();
  useGetAllStories();

  return (
    <div className="flex">

      {/* Feed */}
      <div className="flex-1">
        <Feed />
      </div>

      {/* Right Sidebar */}
      <RightSidebar />

    </div>
  )
}

export default HomePage