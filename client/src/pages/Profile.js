import React, { useState } from 'react'
import Post from '../components/Post'
import { useLocation } from 'react-router-dom';
import ProfileInfo from '../components/ProfileInfo';

const Profile = () => {
  const [posts, setPosts] = useState()
  const location = useLocation()

  return (
    <div className="flex-dashboard--main">
      <ProfileInfo />
      <Post posts={posts} setPosts={setPosts} query={`https://odin-book.site/api${location.pathname}`} />
    </div>
  )
}

export default Profile