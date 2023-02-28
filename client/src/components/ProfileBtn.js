import React from 'react'
import { useNavigate } from "react-router-dom";

const ProfileBtn = () => {

    let navigate = useNavigate();

    const routeChange = () => {
        let path = `/myprofile`;
        navigate(path);
    }

    return (
        <button className="btn profile-btn" onClick={() => routeChange()}>Profile</button>
    )
}

export default ProfileBtn