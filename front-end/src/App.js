import { useEffect, useState } from 'react';
import { Route, Link, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';  
import './App.css';
import Index from './Home';
import Login from './Login';
import Register from './Register'; 
import Cookies from "universal-cookie";
import Logout from './Logout';
import Header from './components/Headers';
import YourPages from './YourPages'
import PageEditting from './PageEditting';


function App(props) {

  const cookies = new Cookies()

  const [loggedIn, setLoggedIn] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [redirect_link, setRedirectLink] = useState("")
  const [path, setPath] = useState("/")

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    setPath(location.pathname)
  })


  return (
      <div className='App'>
      {!(path == '/webpages/add') && <Header />}
        <Routes>

          <Route path='/' element={<Index />}></Route>
          <Route path='/login' element={loggedIn? <Navigate to="/" /> : <Login />}></Route>
          <Route path='/register' element={loggedIn? <Navigate to="/" /> : <Register />}></Route>
          <Route path='/logout' element={<Logout />}></Route>
          <Route path='/webpages' element={<YourPages />}></Route>
          <Route path='/webpages/add' element={<PageEditting />}></Route>
        </Routes>
        </div>
  )


}

App.defaultProps = {
  "loggedIn": false,
  "redirect": false,
  "redirect_link": ""
}

export default App;
