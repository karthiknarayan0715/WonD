import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "./components/Headers"

const Logout = (props) => {
    const cookies = new Cookies();
    cookies.remove("jwt")
    return (<Navigate to="/login" />)
}

export default Logout