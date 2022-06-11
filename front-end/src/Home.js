import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Index = ()=>{
    const navigate = useNavigate()
    const cookies = new Cookies();
    const jwt = cookies.get("jwt")
    const server_uri = "http://127.0.0.1:5000"
    const [user, setUser] = useState({})

    const verifyJWT = async ()=>{
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jwt": jwt})
        }
        const res = await fetch(`${server_uri}/api/getUserData`, req)
        const response = await res.json()
        setUser(response.user)
    }

    useEffect(()=>{
        if(!cookies.get('jwt')){
            navigate("/login")
        }
        verifyJWT()
    }, [<Index />])

    return (
        <div id="home" style={{}}>
            <p>Hello, {user.username} </p>
        </div>
    )
}

export default Index;