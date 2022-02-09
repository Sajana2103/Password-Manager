import React, { useState, useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import '../auth.component/auth.styles.css'
import Vault from '../Vault/vault.component'
import '../signup.component/signup.styles.css'


let getToken


const Settings = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState({})
  const [changeSettings, setChangeSettings] = useState({ email: '', oldPassword:'',newPassword: '', confirmNewPassword: '' })
  const [token, setToken] = useState('')
  const [loginError, setLoginError] = useState({ style: { backgroundColor: '' }, loginError: '' })
  const [showPassword, setShowPassword] = useState('password')
  const loginErrorStyle = {
    backgroundColor: 'rgb(255, 104, 104)',
    color: 'whitesmoke',
  }

  if (token === '') {

    setToken(window.localStorage.getItem('token'))
  }
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}get-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log('Token has expired')
          return
        }
        setUserData(data)
        setChangeSettings({email:data.email})
      })
      .catch(err => console.log('getuser error', err))
  }, [])
  
  const regexEmail = new RegExp('^[A-Za-z0-9._]+@[a-z0-9].+[a-z0-9]{2,}$')
  const regexPassword = (password) => {
    let has8Chars = password.length >= 8 ? 1 : 0
    let hasUppercase = /[A-Z]/.test(password)
    let hasLowercase = /[a-z]/.test(password)
    let hasNumbers = /\d/.test(password)
    let hasSymbols = /\W/.test(password)
    if (hasUppercase + hasLowercase + hasNumbers + hasSymbols + has8Chars < 5) {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Password must contain at least 8 characters, one uppercase, one symbol and one number'

      })
      return
    }

  }
  let emailIsCorrect = regexEmail.test(userData.email)
  const onChange = (e) => {
    const { name, value } = e.target

    setChangeSettings(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const onClick = () => {
    setLoginError({})
  }
  const showPasswordText = () => {
    if (showPassword === 'password') {
      setShowPassword('text')
    } else {
      setShowPassword('password')
    }
  }

  const createAccountSubmit = () => {
    if (userData.email === '' || changeSettings.newPassword === '' || changeSettings.confirmNewPassword === '') {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Email or password is incorrect.'
      })
      return
    } else if (changeSettings.newPassword !== changeSettings.confirmNewPassword) {
      setLoginError({
        style: loginErrorStyle,
        loginError: 'Passwords do not match.'
      })
      return

    } else if (userData.email === changeSettings.confirmNewPassword) {
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
    regexPassword(changeSettings.newPassword)
    
    fetch(`${process.env.REACT_APP_API}change-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:userData.email,...changeSettings})
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setLoginError({
            loginError: data.error
          })
          console.log('change-settings Error', data.error)
        } else {
          
          console.log('change-settings success', data)

        }
      })
      .catch(err => console.log(err))

  }
  return (
    <>

      <div id="auth-div">
        <div className="auth-form signup-background" >
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center' }}>Settings</h3>

            <span className="auth-labels">Email : {userData.email} </span>< br />
            {/* <input onClick={onClick} onChange={onChange} style={loginError.style} type="email" name="email" className="auth-input" placeholder="Email" />< br /> */}
            < hr/>
             <span className="auth-labels">Change Master Password : </span>< br />
            <span style={{fontSize:'14px'}}  className="auth-labels">Old Password </span>< br />
            <div style={{ display: 'flex' }}>
              <input onClick={onClick} style={loginError.style} type={showPassword} onChange={onChange} name="oldPassword"
                className="auth-input small-text" placeholder="Old password" />
              <img src='show.png' onClick={showPasswordText} style={{ marginLeft: '-30px', marginTop: '2px', color: '#282c34', width: 'auto', height: 'auto', maxWidth: '20px', maxHeight: '20px' }} />
            </div>

            <span style={{fontSize:'14px'}} className="auth-labels">New Password </span>< br />
            <div style={{ display: 'flex' }}>
              <input onClick={onClick} style={loginError.style} type={showPassword} onChange={onChange} name="newPassword"
                className="auth-input small-text" placeholder="Must contain at least 8 characters,one uppercase, one symbol,one number" />
              <img src='show.png' onClick={showPasswordText} style={{ marginLeft: '-30px', marginTop: '2px', color: '#282c34', width: 'auto', height: 'auto', maxWidth: '20px', maxHeight: '20px' }} />
            </div>


            <span style={{fontSize:'14px'}}  className="auth-labels">Confirm New Password </span>< br />
            <div style={{ display: 'flex' }}>
              <input onClick={onClick} style={loginError.style} type={showPassword} onChange={onChange} name="confirmNewPassword"
                className="auth-input" placeholder="Confirm new password " title="Must contain at least 8 characters,one uppercase,one symbol a number" />< br />
              <img src='show.png' onClick={showPasswordText} style={{ marginLeft: '-30px', marginTop: '2px', color: '#282c34', width: 'auto', height: 'auto', maxWidth: '20px', maxHeight: '20px' }} />

            </div>
          <hr/>
            <div id="auth-form-btn">
              <button style={{ textDecoration: 'none', textDecorationColor: 'whitesmoke' }}
                onClick={createAccountSubmit} className="border-top" id="auth-submit-btn">Save Settings</button>

              <span id="loginError" className="auth-labels"
                style={{ textAlign: 'center', marginTop: '10px', paddingBottom: '5px' }}>{loginError.loginError}</span>
            </div>
          </div>

        </div>
      </div>


    </>
  )
}

export default Settings


