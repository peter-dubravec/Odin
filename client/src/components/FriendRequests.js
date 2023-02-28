import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const FriendRequests = ({ setFriends, friends }) => {
  const { user } = useAuthContext()

  const [friendRequests, setFriendRequests] = useState([])



  const addFriend = async (id) => {
    const response = await fetch("http://localhost:5000/api/add-friend", {
      headers: {
        'Authorization': 'Bearer ' + user.token,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ friendId: id })
    })

    const json = await response.json()

    if (response.ok) {
      setFriends([...friends, json])
      const newfriendRequests = friendRequests.filter(el => el._id != id)
      setFriendRequests(newfriendRequests)

    }
  }


  useEffect(() => {
    if (user) {
      const fetchRequests = async () => {
        const response = await fetch("http://localhost:5000/api/friend-requests", {
          headers: {
            'Authorization': 'Bearer ' + user.token
          }
        })

        const json = await response.json()

        if (response.ok) {
          console.log(json)
          return setFriendRequests(json)
        }
      }
      fetchRequests()
    }

  }, [user])

  return (
    <>
      <section>
        <h3 className="friends-section-heading">Accept Request</h3>
        <ul>
          {friendRequests?.length ? friendRequests.map(friendRequest => (
            <li key={friendRequest._id}>
              <div className="not-friend">

                <Link to={`/user/${friendRequest._id}`}>
                  {friendRequest.firstname} {friendRequest.lastname}
                </Link>

                <button className="addFriend-btn" onClick={() => addFriend(friendRequest._id)}>Add User</button>
              </div>
            </li>
          )) : <p>No Requests</p>}
        </ul>
      </section>
    </>
  )
}

export default FriendRequests