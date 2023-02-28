import React, { useEffect, useState, CSSProperties } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import Moment from 'react-moment';
import userIcon from "../imgs/user-icon.svg";
import Oval from "react-spinners/ClipLoader";
import { FaTrashAlt } from "react-icons/fa";

const Post = ({ posts, setPosts, query, owner }) => {

    const [comments, setComments] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [commentActive, setCommentActive] = useState([])
    let [loading, setLoading] = useState(false);
    const { user } = useAuthContext()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await fetch(`${query}`, {
                headers: {
                    'Authorization': 'Bearer ' + user.token
                }
            })

            const json = await response.json()
            const { likedPosts } = json.likedPosts

            if (response.ok) {
                setPosts(json.sortedResultsPosts)
                setLikedPosts(likedPosts)
            }
            setLoading(false)
        }

        fetchData()
    }, [user, query])

    const likePost = async (id) => {
        const response = await fetch("https://odin-book.site/api/like-post", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id }),
        })

        const json = await response.json()

        if (response.ok) {
            let newState = posts.map(post => {
                if (post._id === id) {
                    post.postLikes += 1
                    return post
                }
                return post
            })

            setPosts(newState)
            setLikedPosts(json.likedPosts)
        }
    }

    const unLikePost = async (id) => {
        const response = await fetch("https://odin-book.site/api/unlike-post", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id }),
        })

        const json = await response.json()

        if (response.ok) {
            let newState = posts.map(post => {
                if (post._id === id) {
                    post.postLikes -= 1
                    return post
                }
                return post
            })

            setPosts(newState)
            setLikedPosts(json.likedPosts)
        }
    }

    const handleCommentInput = (e, id) => {
        const myComment = comments.find(comment => comment.id === id)
        if (myComment) {
            myComment.text = e.target.value
            const newState = comments.map(comment => comment.id === id ? myComment : comment)
            setComments(newState)
            return
        }

        return setComments([...comments, { text: e.target.value, id }])
    }

    const submitComment = async (e, id) => {
        e.preventDefault()
        const { text } = comments.find(comment => comment.id === id)

        const response = await fetch("https://odin-book.site/api/comment-post", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ commentText: text, id }),
        })

        const json = await response.json()

        if (response.ok) {
            const newState = comments.map(comment => comment.id === id ? { ...comment, text: "" } : comment)
            setComments(newState)

            const myPost = posts.map(post => {
                if (post._id === id) {
                    post.comments = json
                    return post
                }
                return post
            })

            setPosts(myPost)
        }
    }

    const myFunc = (id) => {
        const comment = comments.find(comment => comment.id === id)
        return comment ? comment.text : ""
    }

    const displayLikeState = (id) => {
        const isLiked = likedPosts?.some(el => el == id)
        return isLiked ? "Unlike" : "Like"
    }

    const handleLike = (id) => {
        const isLiked = likedPosts?.some(el => el == id)

        if (isLiked) {
            unLikePost(id)
        }

        if (!isLiked) {
            likePost(id)
        }
    }

    const setActive = (id) => {
        const val = commentActive.some(el => el === id)
        if (val) {
            const newState = commentActive.filter(el => el !== id)
            setCommentActive(newState)
            return
        }

        setCommentActive([...commentActive, id])
        return
    }

    const isActive = (id) => {
        const findVal = commentActive.some(el => el === id)
        return findVal
    }

    const deletePost = async (id) => {
        const response = await fetch("https://odin-book.site/api/delete-post", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id }),
        })

        if (response.ok) {
            const filteredPosts = posts.filter(post => post._id !== id)
            setPosts(filteredPosts)
        }
    }

    return (
        <>
            <Oval
                height={100}
                width={100}
                color="#20c997"
                wrapperstyle={{}}
                wrapperclass=""
                loading={loading}
                aria-label='oval-loading'
                secondarycolor="#20c997"
                strokeWidth={2}
            />

            {posts?.length ? (!loading && posts.map(post =>
            (
                <div key={post._id} className="post">
                    <div className="flex-post--top">
                        <div>
                            <img src={post.createdBy.photo || userIcon} />
                        </div>
                        <div>
                            <p>{post.createdBy.firstname} {post.createdBy.lastname}</p>
                            <p className="post-created-time"><Moment fromNow>{post.createdAt}</Moment></p>
                            {owner && <div className="delete-post" onClick={() => deletePost(post._id)}><FaTrashAlt /><p className="delete-p">Delete</p></div>}
                        </div>
                    </div>
                    <p className="post-text">{post.text}</p>
                    <div className="likes-comments-count--flex">
                        <p>{post.postLikes} {post.postLikes == 1 ? "Like" : "Likes"}</p>
                        <p>{post.comments.length} Comments</p>
                    </div>

                    <div className="comment-btns-div">
                        <button className="post-btn like-btn" onClick={() => handleLike(post._id)}>{displayLikeState(post._id)}</button>
                        <button className="post-btn comment-btn" onClick={() => setActive(post._id)}>Comment</button>
                    </div>

                    <div className={isActive(post._id) ? "comments active" : "comments hidden"}>
                        {post.comments.map(comment => (
                            <div className="comment" key={comment._id}>
                                <div className='comment-heading'>
                                    <div className="comment-heading--flex">
                                        <img src={comment.commentedBy.photo || userIcon} alt="" />
                                        <p>{comment.commentedBy.firstname} {comment.commentedBy.lastname}</p>
                                    </div>
                                    <p><Moment fromNow>{comment.createdAt}</Moment></p>
                                </div>
                                <p className="comment-text">{comment.commentText}</p>
                            </div>
                        ))}
                        <form className="comment-form" onSubmit={(e) => submitComment(e, post._id)}>
                            <textarea className="comment-input" type="text" name="commentText" onChange={(e) => handleCommentInput(e, post._id)} value={myFunc(post._id)} required placeholder='Add comment' />
                            <button className="comment-submit" type="submit">Comment</button>
                        </form>
                    </div>
                </div>
            )
            ))
                : <div>No posts added</div>}
        </>
    )
}

export default Post