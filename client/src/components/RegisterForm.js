import React, { useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";

const RegisterForm = ({ isLoading, setIsLoading, loginError, setLoginError, registerError, setRegisterError }) => {

    const { dispatch } = useAuthContext()

    const [registerData, setRegisterData] = useState({ firstname: "", lastname: "", email: "", password: "" })

    const handleRegister = async (e) => {
        setIsLoading(true)
        setRegisterError("")
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })

        const json = await response.json()

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
        } else {
            setRegisterError(json.error)
        }

        setIsLoading(false)
    }


    return (
        <div className="register-form">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <label htmlFor="firstname">First Name: </label>
                <input type="text" id="firstname" required value={registerData.firstname} onChange={(e) => setRegisterData({ ...registerData, firstname: e.target.value })} />
                <label htmlFor="lastname">Last name: </label>
                <input type="text" id="lastname" required value={registerData.lastname} onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })} />
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
                <label htmlFor="password-register">Password: </label>
                <input type="password" required id="password-register" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
                <button disabled={isLoading} type="submit" className="login-page-btns register-btn">Register</button>
                {registerError && <div dangerouslySetInnerHTML={{ __html: registerError }}></div>}
            </form>
        </div>
    )
}

export default RegisterForm