import React,{useEffect} from 'react';
import {logout} from './redux/userSlice'
import { useDispatch } from 'react-redux';
import './App.css';
import { Outlet ,Link, useNavigate,NavLink} from 'react-router-dom';


const App = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {

   if(window.localStorage.getItem('token')){
     navigate("/vault")
   } else {
     navigate('/sign-in')
   }
  }, [])
       const signout = () => {
    window.localStorage.removeItem('token')
    dispatch(logout())
    navigate("/sign-in")
  }
  return (
   <div className="App" >
     
    <div className="App" >
      <header className="App-header">
        <h1 style={{marginTop:'10px',marginBottom:'10px'}}>PWM</h1>

      </header>
     {
       window.localStorage.getItem('token') ?
       <div style={{display:'grid',gridTemplateRows:'30px',gridAutoFlow:'column',justifyContent:'center'}}>
       <NavLink style={{textDecoration:'none',fontSize:'14px',height:'20px',width:'60px'}} to="vault" className="signup-btn ">Vault</NavLink>
         <NavLink style={{textDecoration:'none',fontSize:'14px',height:'20px',width:'60px'}} to="settings" className="signup-btn ">Settings</NavLink>
       <div style={{textDecoration:'none',fontSize:'14px',height:'20px',width:'60px',}}  className="signup-btn " id="logout-btn" onClick={signout}>Logout</div>
       

         </div>
         
       :

      <div style={{paddingBottom:'10px'}}>
     <Link style={{marginRight:'10px'}} className="signup-btn border-top"   to="/sign-in">Sign-in</Link>
      <Link style={{marginRight:'10px'}} className="signup-btn border-top"  to="/sign-up">Sign-up</Link>
      </div>
     }
      <Outlet/>
      
    
    </div>
    
    </div>
   
  );
}

export default App;
