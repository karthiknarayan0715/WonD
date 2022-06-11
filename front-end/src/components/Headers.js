import Box from './Box'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import DropDown from './DropDown';

const Header = (props) => {

    const cookies = new Cookies()
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(()=>{
        if(cookies.get("jwt")){
            setLoggedIn(true);
        }
        else{
            setLoggedIn(false)
        }
    })
    
    return (
        <div id="header">
            <div className="text"><Link to="/">{props.title}</Link></div>
            {
                <DropDown />
            }
            {    
                loggedIn ? 
                <div className='to_right'><Link to={"/logout"}><Box text="Logout" /></Link>

                </div> :
                <div className="to_right">
                <Link to={"/login"}><Box text="Login" /></Link>
                <Link to={"/register"}><Box text="Register" /></Link> 
                </div>
            }
            </div>
    )
}

Header.defaultProps = {
    'title' : 'WonD'
}

export default Header;