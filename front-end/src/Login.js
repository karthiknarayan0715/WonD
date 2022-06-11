import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Flash from './components/Flash'
import Cookies from "universal-cookie";
import Header from './components/Headers'

const Login = (props)=>{

    const server_url = "http://localhost:5000"
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [flash, setFlash] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    const navigate = useNavigate()

    const cookies = new Cookies()

    useEffect(()=>{
        if(cookies.get("jwt")){
            navigate("/")
        }
    }, [])

    const handleLogin = async (event)=>{
        event.preventDefault()
        const req = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({'username': username, 'password': password}),
        };
        const res = await fetch( `${server_url}/login`, req);
        const response = await res.json();
        console.log(response)
        if(response.logged_in){
            cookies.set("jwt", response.token, {maxAge: 24*60*60})
            setLoggedIn(true)
        }
        else{
            setFlash({"status": "error", "message": "Invalid username or password"})
        }
    }

    return (
    <div className="pageContent" style={{}}>
        {loggedIn && <Navigate to="/" />}
        <div className="holder">
        <div className="form">
        <form>   
            <div className="text">Username</div><input type={"text"} placeholder={"Username"} name="username" onChange={(e)=>setUsername(e.target.value)}></input>
            <div className="text">Password</div><input type={"password"} placeholder={"Password"} name="password" onChange={(e)=>setPassword(e.target.value)}></input><br></br><br></br>
            <button type="button" onClick={handleLogin}>Submit</button>
        </form>
        </div>
        {
            flash && <Flash status={flash.status} message={flash.message} />
        }
        </div>
    </div>
    )
}

Login.defaultProps = {
    "loggedIn": false
}

export default Login;