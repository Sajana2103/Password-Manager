import React, { useState } from 'react'
import CryptoJS, { encryption, decryption } from '../../crypto-js/encryptData'
import { updatePasswordItem ,removePasswordItem,testDispatch} from '../../redux/userSlice'
import {useSelector, useDispatch} from 'react-redux'
import './vault.styles.css'

const VaultPassword = ({ items: { title, password, link, username }, masterPassword, id, email }) => {
  const passwordData = useSelector(state => state.user.userData.passwords)
  

  const dispatch = useDispatch()
  const [display, setDisplay] = useState({ valueDisplay: 'block', inputDisplay: 'none', update: 'Update' })

  let passwordHidden
  let passLength
  let item = { title, password, link, username }
  let itemCopy = { title, password, link, username }

  let decryptedItem = {}
  if (item.title !== undefined) {
    try {
      for (let key in item) {
        let bytes = decryption(item[key], masterPassword)
        let decryptedData = bytes.toString(CryptoJS.enc.Utf8)
   
        decryptedItem[key] = decryptedData
      }

    } catch (error) {
      // console.log('Decryption Error : ', error)

    }
  }
  if (decryptedItem.password) {

    passLength = decryptedItem.password.length
    passwordHidden = passLength > 15 ? `${'*'.repeat(15)}...` : '*'.repeat(passLength)

  }
 
    const [showPassword, setShowPassword] = useState(passwordHidden)

  const showPasswordText = () => {

    if (showPassword === passwordHidden) {
      setShowPassword(decryptedItem.password)
    } else {
      setShowPassword(passwordHidden)
    }
  }


  let key
  let value

  const onChange = (e) => {
    key = e.target.name
    value = e.target.value

    item[key] = value
  }


  const updateItem = () => {

    if (display.inputDisplay === 'none') {
      setDisplay({ valueDisplay: 'none', inputDisplay: 'block', update: 'Done' })
    } else {
      setDisplay({ valueDisplay: 'block', inputDisplay: 'none', update: 'Update' })
    }

  }
  const cancelUpdate = () => {
    let inputValue = document.getElementsByClassName(`password-card-input-${id}`)
    for (let i = 0; i < inputValue.length; i++) {
      inputValue[i].value = ''
    }

    if (display.inputDisplay === 'block') {
      setDisplay({ valueDisplay: 'block', inputDisplay: 'none', update: 'Update' })
    }
  }
  const updateItemDone = async (e) => {
      e.preventDefault()
    let encryptedItem = {}
    for (let key in item) {
      if (item[key] !== itemCopy[key]) {
        encryptedItem[key] = encryption(item[key], masterPassword).toString()
      } else {
        encryptedItem[key] = item[key]
      }
    }
    if (JSON.stringify(item) === JSON.stringify(itemCopy)) {
      // console.log(`item ${item} and itemCopy ${itemCopy} is `)
      setDisplay({ valueDisplay: 'block', inputDisplay: 'none', update: 'Update' })
      return
    }

    let updatePasswordIndex = `passwords.${id}`
    let modifiedPassword = {}

    modifiedPassword[updatePasswordIndex] = encryptedItem
    if (display.inputDisplay === 'block') {
      setDisplay({ valueDisplay: 'block', inputDisplay: 'none', update: 'Update' })
    }
    try {

      await fetch(`${process.env.REACT_APP_API}update-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, data: modifiedPassword })
      })
      .then(res => res.json())
      .then(data => {
        if(data.acknowledged){
          console.log("update-item",data,encryptedItem)
          dispatch(updatePasswordItem({id:id,data:encryptedItem}))
        }
      })

    } catch (error) {
      return {
        ok: false
      }
    }

  }
  const removeItem = async () => {
  
    try {
      await fetch(`${process.env.REACT_APP_API}remove-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, data: item })
      })
      .then(res => res.json())
      .then(data => {
        if(data.acknowledged){
       dispatch(removePasswordItem({id:id}))
      
        }
      })
    } catch (error) {
      return {
        ok: false
      }
    }
  }


  return (
    <form  className='vault-password' title={decryptedItem.title} >

      <div style={{ backgroundColor: '#282c34', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
        <p className='password-card-title' id='password-card-title' style={{ display: display.valueDisplay,overflow: 'auto',  height:'30px',marginLeft:'10px',marginRight:'10px'}} >{decryptedItem.title} </p>
        <input className={`password-card-input-${id}`} id="password-card-input" onChange={onChange}
          style={{ display: display.inputDisplay, marginLeft: '20px', color: 'whitesmoke', fontSize: '14px', border: '1px solid whitesmoke', height: '20px', backgroundColor: 'transparent' }} name='title' placeholder={decryptedItem.title} />
      </div>
      <div className='password-content'>

        <h5 id='password-card-key'>Username : </h5>
        <p style={{ display: display.valueDisplay ,overflow: 'auto',maxWidth:'150px' }} id='-passwordcard-value'>{decryptedItem.username} </p>
        <input className={`password-card-input-${id}`} id="password-card-input" onChange={onChange} style={{ display: display.inputDisplay }} name='username' placeholder={decryptedItem.username} />

        <h5 id='password-card-key'>Password : </h5>
        <div style={{ display: 'grid', gridTemplateColumns: '150px 20px' }}>
          <p style={{ display: display.valueDisplay, overflow: 'auto', marginBottom: '3px' }} type={showPassword} id='password-card-value'>{showPassword}</p>
          <input className={`password-card-input-${id}`} type={showPassword} id="password-card-input" onChange={onChange} style={{ display: display.inputDisplay }} name='password' placeholder={showPassword} />
          <img id="show-password" src='show.png' onClick={showPasswordText} 
          style={{ position:'relative', marginTop: '4px', color: '#282c34', width: 'auto', height: 'auto', maxWidth: '16px', maxHeight: '16px',marginLeft:'-15px' }} />
        </div>

        <h5 id='password-card-key'>Link : </h5>
        <a style={{ display: display.valueDisplay,overflow: 'auto',maxWidth:'150px' }} id='password-card-link' href={decryptedItem.link}>{decryptedItem.link}</a>
        <input className={`password-card-input-${id}`} id="password-card-input" onChange={onChange} style={{ display: display.inputDisplay }} name='link' placeholder={decryptedItem.link} />
      </div>

      <div style={{ display: 'flex', float: 'right' }}>

        <span onClick={updateItem} id="update-btn" style={{ display: display.valueDisplay }}>Update</span>
        <input value="Done" type="submit" onClick={updateItemDone} id="update-submit-btn" style={{ display: display.inputDisplay }} />
        <span onClick={cancelUpdate} id="update-btn" style={{ display: display.inputDisplay }}>Cancel</span>


        <span type="submit" onClick={removeItem} id="update-btn" >Delete</span>

      </div>

    </form>
  )
}

export default VaultPassword