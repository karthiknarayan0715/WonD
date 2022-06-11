import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Flash from './components/Flash'

const Register = (props)=>{

    const server_url = "http://localhost:5000"

    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();

    const cookies = new Cookies()

    const navigate = useNavigate()

    useEffect(()=>{
        if(cookies.get("jwt")){
            navigate("/")
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const req = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"name": name, "username": username, "password": password, "email": email})
        }

        const res = await fetch(`${server_url}/register`, req)
        const response = await res.json();

        if(response.created_user){
            navigate("/login")
        }
        else{
            return <Flash status="error" message={response.error}/>
        }
    }


    return (
    <div className="pageContent" style={{}}>
        {props.loggedIn ? 
        <Navigate to="/" /> 
        :
            <div className="form">
            <form>   
                <div className="text">Name</div><input type={"text"} placeholder={"Name"} name="name" onChange={(e)=>setName(e.target.value)}></input>
                <div className="text">Username</div><input type={"text"} placeholder={"Username"} name="username" onChange={(e)=>setUsername(e.target.value)}></input>
                <div className="text">Password</div><input type={"password"} placeholder={"Password"} name="password" onChange={(e)=>setPassword(e.target.value)}></input>
                <div className="text">Email</div><input type={"text"} placeholder={"Email"} name="email" onChange={(e)=>setEmail(e.target.value)}></input><br></br><br></br>
                <button type="button" onClick={handleSubmit}>Submit</button>
            </form>
            </div>
        }
    </div>
    )
    
}

export default Register;