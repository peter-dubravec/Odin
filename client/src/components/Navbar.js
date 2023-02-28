import React from 'react'
import Logout from './Logout'
import ProfileBtn from "./ProfileBtn"
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
    const { user } = useAuthContext()

    return (

        <div className="navbar-wrapper">
            <div className="navbar"><a href="/">Odin</a></div>
            {user && <div className="profile-logout-btns-wrapper">
                <ProfileBtn />
                <Logout />
            </div>}
        </div>


    )
}

export default Navbar