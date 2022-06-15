import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie"
import Box from "./components/Box";
import $ from 'jquery'

const YourPages = ()=>{

    const cookies = new Cookies();
    const jwt = cookies.get("jwt")
    const [user, setUser] = useState({})
    const [pages, setPages] = useState([])
    const server_url = "http://127.0.0.1:5000"
    const navigate = useNavigate()

    const verifyJWT = async ()=>{
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jwt": jwt})
        }
        const for_user_data = await fetch(`${server_url}/api/getUserData`, req)
        const user_data = await for_user_data.json()
        const user = await user_data.user
        setUser(user)
        
        const for_pages = await fetch(`${server_url}/api/websites`, req)
        const pages_res = await for_pages.json()
        const pages = await pages_res.pages
        setPages([...pages])
    }

    useEffect(()=>{
        verifyJWT()
    }, [])
    useEffect(()=>{
        setGotData(true)
    }, [user, pages])
    const openNewSiteWindow = ()=>{
        $(".window-back").addClass("active")
    }
    const closeNewSiteWindow = ()=>{
        $(".window-back").removeClass("active")
    }

    const [siteName, SetSiteName] = useState("")
    const [mainRoute, SetMainRoute] = useState("")
    const [gotData, setGotData] = useState(false)

    const addWebSite = async ()=>{
        const req = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({"site_name": siteName, "main_route_name": mainRoute, "jwt": cookies.get("jwt")}),
        };
        const res = await fetch( `${server_url}/api/websites/add`, req);
        const response = await res.json();
        navigate("/webpages/add", {state: {"site_id": response.site_id}})
    }

    return (
        <div style={{"height": "100%"}}>
        <div className="YourPages">
            <div className="holder">
                    <div className="gotSites">{pages && pages.length > 0 ? <p>You have webpages</p> : <p>You got no webpages</p>}</div><div className="break"></div>
                    <div className="websites">
                        {
                            pages &&
                            pages.length > 0 &&
                            pages.map((page)=>{
                                return(
                                    <div className="block" key={page._id} onClick={()=>{navigate("/webpages/add", {"state": {"site_id": page._id}})}}><div className="text">{page.name}</div></div>
                                )
                            })
                        }
                </div>
                <div style={{"display":"flex", "justifyContent": "center", "width": "100%"}}><Box text="New Page" onClick={openNewSiteWindow}/></div>
            </div>
        </div>
        <div className="window-back">
            <div className="window">
                <div className="heading"><div className="text">New Site</div><div id="closeButton" onClick={closeNewSiteWindow}>X</div></div>
                <div className="form-content">
                    <div style={{"display": "block"}}>
                        <div className="text">Site Name</div><input type="text" onChange={(event)=>{SetSiteName(event.target.value)}}></input><br></br><br></br>
                        <div className="text">Main Route</div><input type="text" onChange={(event)=>{SetMainRoute(event.target.value)}}></input><br></br><br></br>
                        <div className="button"><button onClick={addWebSite}>Create Website</button></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default YourPages;