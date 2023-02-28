import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import userIcon from "../imgs/user-icon.svg";
import Popup from 'reactjs-popup';
import HamburgerMenu from './HamburgerMenu';

const MyProfileInfo = ({ posts, setPosts }) => {
    const { user } = useAuthContext()
    const [userData, setUserData] = useState({})
    const [url, setUrl] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5000/api/myprofile`, {
                headers: {
                    'Authorization': 'Bearer ' + user.token,
                }
            })

            const json = await response.json()
            if (response.ok) {
                setUserData(json)
            }
        }

        fetchData()
    }, [user])

    const handlePhotoChange = async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:5000/api/change-photo", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ url })
        })

        if (response.ok) {
            setUserData({ ...userData, photo: url })
            const newPosts = posts.map(post => {
                post.createdBy.photo = url
                return post
            })
            setPosts(newPosts)
        }
    }

    return (
        <div className="profile-info-flex">
            <div className="profile-info-flex--left">
                <img className="profile-photo" src={userData?.photo || userIcon} />
                <div>
                    <p className="name firstname">{userData?.firstname} {userData?.lastname}</p>
                    <p className="friend-count">You have {userData?.friendsCount} {userData?.friendsCount === 1 ? "friend" : "friends"}</p>
                </div>
            </div>
            <Popup trigger={<button className="change-photo-btn">Change Photo</button>}>

                <form className="profile-photo-form" onSubmit={(e) => handlePhotoChange(e)}>
                    <input placeholder="Provide image url" type="text" required onChange={(e) => setUrl(e.target.value)} />
                    <button>Submit</button>
                </form>
            </Popup>

        </div>
    )
}

export default MyProfileInfo