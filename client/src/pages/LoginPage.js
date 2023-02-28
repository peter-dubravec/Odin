import React, { useState } from 'react'
import LoginForm from "../components/LoginForm"
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [registerError, setRegisterError] = useState("")

    const props = {
        isLoading, setIsLoading, loginError, setLoginError, registerError, setRegisterError
    }


    return (
        <div className="login-register--flex">
            <LoginForm {...props} />
            <div className="line separator"></div>
            <div className="line middle-paragraph">Or</div>
            <RegisterForm {...props} />
        </div>
    )
}

export default LoginPage