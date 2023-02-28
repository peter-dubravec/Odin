import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import CreatePost from './CreatePost';
import Post from './Post';

const Posts = () => {
    const [posts, setPosts] = useState()

    const { user } = useAuthContext()


    return (
        <>

            <CreatePost setPosts={setPosts} posts={posts} />
            <Post posts={posts} setPosts={setPosts} query={"https://odin-book.site/api/dashboard"} />

        </>
    )
}

export default Posts