import React, { useRef, useEffect } from "react";


function useOutsideAlerter(ref, isOpen, setIsOpen) {

    useEffect(() => {

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (isOpen) {
                    console.log(isOpen)
                    const openedDiv = document.querySelector(".hamburger-nav-items")
                    openedDiv.classList.remove("show")
                    setIsOpen((prev) => !prev)
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, isOpen]);
}


export default function OutsideAlerter(props) {
    const { isOpen, setIsOpen } = props
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, isOpen, setIsOpen);

    return <div ref={wrapperRef}>{props.children}</div>;
}