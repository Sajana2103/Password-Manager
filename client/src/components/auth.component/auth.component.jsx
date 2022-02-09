import React, { useState} from "react";
import {useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'

import { getToken  } from "../../redux/userSlice";


import './auth.styles.css'



const AuthenticateUser = () => {

  const token = useSelector(state => state.user.token)
  // console.log(token)
  const dispatch = useDispatch()
  const [auth, setAuth] = useState({ email: '', password: '' })
 
  const [loginError,setLoginError] = useState({backgroundColor:'',loginError:''})
  const [showPassword,setShowPassword] = useState('password')

  const navigate = useNavigate()
  const onChange = (e) => {
    const { name, value } = e.target
    setAuth(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  if(token !==  ''){

   window.localStorage.setItem('token',token)
  }
  const onClick = () => {
    setLoginError({})
  }
 
const showPasswordText = () => {
    if(showPassword === 'password'){
      setShowPassword('text')
    } else {
      setShowPassword('password')
    }
  }
  const authSubmit = (e) => {
    e.preventDefault()
    if(auth.email === '' || auth.password ===''){
      setLoginError({
    backgroundColor:'rgb(255, 104, 104)',
    loginError:'Email or password is incorrect'
  })
      // console.log('Email or password required')
      return
    }
    auth.email = auth.email.toLowerCase()
    fetch(`${process.env.REACT_APP_API}signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auth)
    })
      .then(res => res.json())
      .then(data => {
        if(data.error){
          setLoginError({
    loginError: data.error
  })
        } else {
      
        dispatch(getToken(data))}
        })
      .catch(err => console.log(err))

  }
 
  // console.log('setToken : ',token,'get Token :',getToken)
  return (
    <div>
      {
        window.localStorage.getItem('token')? 
        navigate('/vault')
      :

          <div id="auth-div">
            <form className="auth-form" >
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ textAlign: 'center' }}> Sign in</h3>

                <span className="auth-labels">Email </span>< br />
                <input  onChange={onChange} name="email" className="auth-input" placeholder="User email" />< br />


                <span className="auth-labels">Password </span>< br />
                <div style={{display:'flex'}}>
                <input onClick={onClick} style={loginError}type={showPassword} onChange={onChange} name="password" className="auth-input" placeholder="password" />< br />
                   <img src='show.png' onClick={showPasswordText} style={{marginLeft:'-30px',marginTop:'2px',
                   color:'#282c34',width:'auto',height:'auto',maxWidth:'20px',maxHeight:'20px'}}/>
                </div>
                <div id="auth-form-btn">
                  <button style={{textDecoration:'none',textDecorationColor:'whitesmoke'}} to={"/vault"} type="submit" onClick={authSubmit} className="border-top" id="auth-submit-btn">Sign-in</button>
{/* 
                  <span style={{ marginTop: '10px', paddingBottom: '5px' }}>Not signed up?</span>
                  <Link to={"/signup"} className="signup-btn">Sign-up</Link> */}
                <span id="loginError" className="auth-labels" 
                style={{textAlign:'center',marginTop: '10px', paddingBottom: '5px'}}>{loginError.loginError}</span>
                </div>
              </div>

            </form>
          </div>
      }
          

    </div>

  )
}

export default AuthenticateUser