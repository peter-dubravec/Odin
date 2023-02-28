import React from 'react'
import { Link } from "react-router-dom";

const Friend = ({ friends }) => {


    return (
        <>
            <section>
                <h3 className="friends-section-heading">Friends</h3>
                <ul>
                    {friends?.length ? friends.map(friend => (
                        <li key={friend._id}>
                            <Link to={`/user/${friend._id}`}>
                                {friend.firstname} {friend.lastname}
                            </Link>

                        </li>
                    )) : <p>You have no friends</p>}
                </ul>
            </section>

        </>
    )
}

export default Friend