import React, { useState } from 'react'
import Friends from './Friends'
import OutsideAlerter from "../hooks/useOutsideAlerter";

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="sidePandel">
            <div className={isOpen ? "menu-btn close" : "menu-btn"} onClick={() => setIsOpen((prev) => !prev)}>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
                <div className="btn-line"></div>
            </div>
            <div className={isOpen ? "hamburger-nav-items show" : "hamburger-nav-items"}>
                <OutsideAlerter isOpen={isOpen} setIsOpen={setIsOpen}>
                    <div className="friends-wrapper">
                        <Friends inHamburger={true} setIsOpen={setIsOpen} />
                    </div>
                </OutsideAlerter>
            </div>
        </div>
    )
}

export default HamburgerMenu