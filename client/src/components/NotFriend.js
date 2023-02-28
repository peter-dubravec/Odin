import { useAuthContext } from "../hooks/useAuthContext"
import { Link } from "react-router-dom";

const NotFriend = ({ setError, notFriends, sentFriendRequests, setSentFriendRequests }) => {
    const { user } = useAuthContext()

    const sendRequest = async (id) => {

        const response = await fetch("http://localhost:5000/api/send-request", {
            headers: {
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ friendRequestId: id })
        })

        const json = await response.json()

        if (response.ok) {
            const newSentFriendRequests = sentFriendRequests.concat(json)
            setSentFriendRequests(newSentFriendRequests)
        } else {
            console.log(json.error)
        }
    }

    const isReqSent = (id) => {
        const isSent = sentFriendRequests?.some(el => el == id)
        return isSent
    }



    return (
        <>
            <section>
                <h3 className="friends-section-heading">Other Users</h3>
                <ul>
                    {notFriends?.length ? notFriends.map(notFriend => (

                        <li key={notFriend._id}>
                            <div className="not-friend">
                                <Link to={`/user/${notFriend._id}`}>
                                    {notFriend.firstname} {notFriend.lastname}
                                </Link>

                                <button className={isReqSent(notFriend._id) ? "request-btn pending" : "request-btn send"} onClick={(e) => !isReqSent(notFriend._id) && sendRequest(notFriend._id)}>{isReqSent(notFriend._id) ? "Pending" : "Request"}</button>
                            </div>
                        </li>

                    )) : <p>Everyone is your friend</p>
                    }
                </ul>
            </section>

        </>
    )
}

export default NotFriend