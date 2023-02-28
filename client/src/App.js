import './App.css';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuthContext } from "./hooks/useAuthContext"

import LoginPage from "./pages/LoginPage.js"
import Dashboard from './pages/Dashboard';
import Navbar from "./components/Navbar"
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Friends from './components/Friends'
import React, { useEffect } from 'react';
import HamburgerMenu from './components/HamburgerMenu';

import Cookies from 'js-cookie'

function App() {
  const { user } = useAuthContext()
  const location = useLocation()
  let navigate = useNavigate();

  // Login from FB
  useEffect(() => {
    const token = Cookies.get("login_token")
    if (token) {
      Cookies.remove("login_token")
      localStorage.setItem('user', JSON.stringify({ message: "logged in", token }))
    }
    navigate("/")
  }, [])

  return (
    <div className="page-wrapper">
      <Navbar />
      <Friends />
      {user && <HamburgerMenu />}
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <LoginPage />} />
          <Route path="/myprofile/" element={user ? <MyProfile /> : <Navigate to="/" />} />
          <Route path="/user/:id/" element={user ? <Profile /> : <LoginPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
