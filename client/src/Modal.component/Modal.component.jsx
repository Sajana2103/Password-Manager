import React, { useState } from 'react'
import { encryption } from '../crypto-js/encryptData'
import { addItem } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import './modal.styles.css'



const ModalForm = ({ password, email }) => {

  const [showPassword, setShowPassword] = useState('password')
  const dispatch = useDispatch()

  var modal = document.getElementById('modal')
  var passwordInput = document.getElementsByClassName('password-input')

  let item = {}
  const onChange = (e) => {
    let key = e.target.name
    let value = e.target.value

    item[key] = value

    // console.log('item : ', item)
  }

  const showPasswordText = () => {
    if (showPassword === 'password') {
      setShowPassword('text')
    } else {
      setShowPassword('password')
    }
  }

  const closeModal = (event) => {
    if (event.target.id === 'modal-close-btn') {

      modal.style.display = 'none'

      // console.log(event.target)
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault()
    let encryptedData = {}
    for (let key in item) {
      encryptedData[key] = encryption(item[key], password).toString()
    }
    if (item.title === undefined) {
      console.log('Title is required')
      return
    } else {
      try {

        await fetch(`${process.env.REACT_APP_API}add-item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email, data: encryptedData })
        })
          .then(res => res.json())
          .then(data => {
            if (data.acknowledged) {
              // console.log(item)
              dispatch(addItem(encryptedData))
              for (let key in passwordInput) {
                if (typeof (passwordInput[key].value) === 'string')
                  passwordInput[key].value = ''
              }
              modal.style.display = 'none'



            }
          })
      } catch (error) {
        return {
          ok: false
        }
      }

    }
    // console.log(email,encryptedData)

  }

  return (
    <form id='modal-form'>
      <div id="modal-close-btn" onClick={closeModal}>X</div>
      <h3 style={{ color: '#282c34 ', padding: '5px' }}>
        Add Password
      </h3>
      <div id="password-form" type="submit"  >
        <div id="form-field" >
          <label >Title : </label><br />
          <input onChange={onChange} className="password-input" type="text" id="title" name="title" placeholder='Required!' />
        </div>
        <div id="form-field" >
          <label >Username : </label><br />
          <input onChange={onChange} className="password-input" type="text" id="username" name="username" />
        </div>
        <div id="form-field">
          <label >Password : </label><br />
          <div style={{ display: 'flex' }}>
            <input onChange={onChange} className="password-input" type={showPassword} id="password" name="password" />
            <img src='show.png' onClick={showPasswordText} style={{
              marginLeft: '-30px', marginTop: '3px',
              color: '#282c34', width: 'auto', height: 'auto', maxWidth: '20px', maxHeight: '20px'
            }} />
          </div>
        </div>
        <div id="form-field">
          <label >Link : </label><br />
          <input onChange={onChange} className="password-input" type="link" id="link" name="link" />
        </div>
        <div id="form-field" >
          <button style={{ position: 'relative', float: 'right' }}
            id="modal-submit" type="submit" onClick={onSubmit} value="Submit" >Submit</button>
        </div>

      </div>
    </form>
  )
}

export default ModalForm