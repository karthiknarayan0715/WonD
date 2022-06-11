import { useEffect } from "react"
import { Link } from "react-router-dom"
import $ from 'jquery'

const DropDown = (props)=>{

    const closeDropDown = ()=>{
        const content = document.querySelector(".dropdown .content")
        content.classList.remove("active")
    }
    const openDropDown = ()=>{
        const content = document.querySelector(".dropdown .content")
        content.classList.add("active")
    }

    const toggleDropDown = ()=>{
        const toggle = document.querySelector(".toggle-dropdown")
        const content = document.querySelector(".dropdown .content")
        if(content.classList.contains("active")){
            closeDropDown()
        }
        else{
            openDropDown()
        }
    }
    useEffect(()=>{
        $('.toggle-dropdown').on("click", ()=>{
            toggleDropDown();
        })
    })

    return (
        <div className="dropdown">
            <div className="toggle-dropdown">
                Services <b>˅</b>
            </div>
            <div className="content">
                <Link to={"/webpages"}><div className="item">ONLINE WEBSITE MAKER</div></Link>  
                <div className="item">CONTACTS</div>
                <div className="item">ABOUT</div>
            </div>
        </div>
    )
}

export default DropDown;