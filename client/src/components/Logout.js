import React from 'react'

import { useLogout } from "../hooks/useLogout"


const Logout = () => {
    const { logout } = useLogout()



    return (
        <>
            <button className="btn logout-btn" onClick={() => logout()}>Logout</button>
        </>
    )
}

export default Logout