import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getToken } from '../../redux/userSlice'

import '../auth.component/auth.styles.css'
import './signup.styles.css'


const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userToken = useSelector(state => state.user.token)
  const [signup, setSignup] = useState({ email: '', password: '', confirmPassword: '' })
  const [loginError, setLoginError] = useState({ style: { backgroundColor: '' }, loginError: '' })
  const [showPassword,setShowPassword] = useState('password')
  const loginErrorStyle = {
    backgroundColor: 'rgb(255, 104, 104)',
    color: 'whitesmoke',
  }
  const regexEmail = new RegExp('^[A-Za-z0-9._]+@[a-z0-9].+[A-Za-z0-9]{2,}$')
  const regexPassword = (password) =>{
   let has8Chars= password.length >= 8 ? 1 : 0
   let hasUppercase =  /[A-Z]/.test(password)
   let hasLowercase = /[a-z]/.test(password)
   let hasNumbers = /\d/.test(password)
   let hasSymbols = /\W/.test(password)
   if(hasUppercase+hasLowercase+hasNumbers+hasSymbols+has8Chars < 5 ){
     setLoginError({
        style: loginErrorStyle,
        loginError: 'Password must contain at least 8 characters, one uppercase, one symbol and one number'
      
     })
     return
   }

  }
   
  let emailIsCorrect = regexEmail.test(signup.email)
  const onChange = (e) => {
    const { name, value } = e.target

    setSignup(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  if (userToken !== '') {

    window.localStorage.setItem('token', userToken)
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

  const createAccountSubmit = (e) => {
    e.preventDefault()
 
    if (signup.email === '' || signup.password === '' || signup.confirmPassword === '') {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Email or password is incorrect.'
      })
      return
    } else if (signup.password !== signup.confirmPassword) {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Passwords do not match.'
      })
      return

    } else if (signup.email === signup.confirmPassword) {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Using your email as password is not allowed.'
      })
      return
    } else if (!emailIsCorrect) {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Invalid email format.'
      })
      return
    }
    regexPassword(signup.password)
    signup.email = signup.email.toLowerCase()
   
      fetch(`${process.env.REACT_APP_API}add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signup)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setLoginError({
              loginError: data.error
            })
            console.log('adduser Error',data.error)
          } else {
            dispatch(getToken(data))
             console.log('adduser success',data)
              navigate('/vault')
          }
        })
        .catch(err => console.log(err))

    }
    return (
      <>
      {
        window.localStorage.getItem('token') === userToken?
        navigate('/vault')
        :

        <form id="auth-div">
          <div className="auth-form signup-background" >
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ textAlign: 'center' }}> Sign-up</h3>

              <span className="auth-labels">Email </span>< br />
              <input onClick={onClick} onChange={onChange} style={loginError.style} type="email" name="email" className="auth-input" placeholder="Email" />< br />
              <span className="auth-labels">Password </span>< br />

              <div style={{display:'flex'}}>
              <input onClick={onClick} style={loginError.style} type={showPassword} onChange={onChange} name="password" 
              className="auth-input small-text" placeholder="Must contain at least 8 characters,one uppercase, one symbol,one number" />
              <img src='show.png' onClick={showPasswordText} style={{marginLeft:'-30px',marginTop:'2px',color:'#282c34',width:'auto',height:'auto',maxWidth:'20px',maxHeight:'20px'}}/>
              </div>

              <span className="auth-labels">Confirm password </span>< br />
              <div style={{display:'flex'}}>
              <input onClick={onClick} style={loginError.style} type={showPassword} onChange={onChange} name="confirmPassword" 
              className="auth-input" placeholder="Confirm password " title="Must contain at least 8 characters,one uppercase,one symbol a number"/>< br />
                              <img src='show.png' onClick={showPasswordText}  style={{marginLeft:'-30px',marginTop:'2px',color:'#282c34',width:'auto',height:'auto',maxWidth:'20px',maxHeight:'20px'}}/>

                </div>
              <div id="auth-form-btn">
                <button style={{ textDecoration: 'none', textDecorationColor: 'whitesmoke' }}
                  onClick={createAccountSubmit} className="border-top" type="submit" id="auth-submit-btn">Create Account</button>

                <span id="loginError" className="auth-labels"
                  style={{ textAlign: 'center', marginTop: '10px', paddingBottom: '5px' }}>{loginError.loginError}</span>
              </div>
            </div>

          </div>
        </form>
      }
  
      </>
    )
  }

  export default Signup


