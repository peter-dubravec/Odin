import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import userIcon from "../imgs/user-icon.svg";
import { FaCheck, FaUserTimes } from "react-icons/fa";

const ProfileInfo = ({ owner }) => {
    const { user } = useAuthContext()
    const [userData, setUserData] = useState()
    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:5000/api/profile${location.pathname}`, {
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
    }, [user, location.pathname])

    return (
        <div className="profile-info-flex">
            <div className="profile-info-flex--left">
                <img className="profile-photo" src={userData?.photo || userIcon} />
                <div>
                    <p className="name firstname">{userData?.firstname} {userData?.lastname}</p>
                    <p className="friend-count">Has {userData?.friendsCount} {userData?.friendsCount === 1 ? "friend" : "friends"}</p>
                </div>
            </div>
            {userData?.isFriend ? <div className="user-status"><FaCheck /> <p>Friends</p></div> : <div className="user-status"><FaUserTimes /> <p>Not Friends</p></div>}
        </div>
    )
}

export default ProfileInfo