import React, { useState } from 'react'
import MyProfileInfo from '../components/MyProfileInfo'
import Post from '../components/Post'

const MyProfile = () => {
    const [posts, setPosts] = useState()
    console.log(posts)
    return (
        <div className="flex-dashboard--main">
            <MyProfileInfo posts={posts} setPosts={setPosts} />
            <Post posts={posts} setPosts={setPosts} query={`http://localhost:5000/api/owner-posts`} owner={true} />
        </div>
    )
}

export default MyProfile