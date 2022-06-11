import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie"
import Box from "./components/Box";

const YourPages = ()=>{

    const cookies = new Cookies();
    const jwt = cookies.get("jwt")
    const [user, setUser] = useState()
    const [pages, setPages] = useState()
    const server_uri = "http://127.0.0.1:5000"

    const verifyJWT = async ()=>{
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jwt": jwt})
        }
        const for_user_data = await fetch(`${server_uri}/api/getUserData`, req)
        const user_data = await for_user_data.json()
        setUser(user_data.user)
        
        const for_pages = await fetch(`${server_uri}/api/websites`, req)
        const pages = await for_pages.json()
        setPages(pages.pages)
    }

    useEffect(()=>{
        verifyJWT()
    })

    return (
        <div className="YourPages" style={{}}>
            <div className="holder">
            <div className="gotSites">{pages && pages.length > 0 ? <p>You have webpages</p> : <p>You got no webpages</p>}</div>
            <div className="websites"></div>
            <Link to="/webpages/add"><Box text="New Page" /></Link>
            </div>
        </div>
    )
}

export default YourPages;