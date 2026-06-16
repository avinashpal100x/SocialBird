import React from 'react'
import Feed from '../components/posts/Feed'
import RightSidebar from '../components/sidebar/RightSidebar'
import useGetAllPosts from '../hooks/useGetAllPosts.js'


const HomePage = () => {

  useGetAllPosts();

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