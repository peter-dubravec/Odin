import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

import FriendRequests from './FriendRequests'
import Friend from './Friend'
import NotFriend from './NotFriend'
import { FaTimes } from "react-icons/fa"

const Friends = ({ inHamburger, setIsOpen }) => {

  const [notFriends, setNotFriends] = useState([])
  const [friends, setFriends] = useState([])
  const [sentFriendRequests, setSentFriendRequests] = useState([])
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const response = await fetch("https://odin-book.site/api/friendslist", {
          headers: {
            'Authorization': 'Bearer ' + user.token
          }
        })

        const json = await response.json()

        if (response.ok) {
          setFriends(json.friends)
          setNotFriends(json.notFriends)
          setSentFriendRequests(json.sentRequests)
        }
      }
      fetchData()
    }
  }, [user])


  const handleFriends = { notFriends, setNotFriends, friends, setFriends, sentFriendRequests, setSentFriendRequests }

  return (
    <>
      {user && (<div className="friends-panel">
        {inHamburger && <FaTimes className="hamburger-close-btn" onClick={() => setIsOpen((prev) => !prev)} />}
        <Friend {...handleFriends} />
        <NotFriend {...handleFriends} />
        <FriendRequests setFriends={setFriends} friends={friends} />
      </div>)}
    </>
  )
}

export default Friends