import React, { useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { FaFacebookSquare, FaUserAlt } from "react-icons/fa";

const LoginForm = ({ isLoading, setIsLoading, loginError, setLoginError, registerError, setRegisterError }) => {

    const { dispatch } = useAuthContext()

    const [loginData, setLoginData] = useState({ email: "", password: "" })



    const handleLoginSubmit = async (e) => {
        setIsLoading(true)
        setLoginError("")
        setRegisterError("")
        e.preventDefault();

        const response = await fetch("https://odin-book.site/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const json = await response.json()

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
        } else {
            setLoginError(json.error)
        }
        setIsLoading(false)
    }

    const facebook = () => {
        setIsLoading(true)
        return window.open("https://odin-book.site/api/auth/facebook", "_self")
    }

    const testUser = async () => {
        setIsLoading(true)
        const response = await fetch("https://odin-book.site/api/testuser")
        const json = await response.json()
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json))
            dispatch({ type: 'LOGIN', payload: json })
        }
        setIsLoading(false)
    }

    return (
        <>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <label htmlFor="email">Email: </label>
                    <input type="email" id="email" required value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                    <label htmlFor="password-login">Password: </label>
                    <input type="password" required id="password-login" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    <button disabled={isLoading} type="submit" className="login-page-btns login-btn">Login</button>
                    {loginError && <div dangerouslySetInnerHTML={{ __html: loginError }}></div>}
                </form>

                <button disabled={isLoading} className="facebook--btn" onClick={facebook}><FaFacebookSquare />Login with FB</button>
                <button disabled={isLoading} className="test-user--btn" onClick={testUser}><FaUserAlt />Test User</button>
            </div>
        </>
    )
}

export default LoginForm