import React, { useState, useEffect} from 'react'
import VaultPassword from './vault-password'
import ModalForm from '../../Modal.component/Modal.component'
import './vault.styles.css'
import './button.style.css'
import {Outlet} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { getUser  } from "../../redux/userSlice";

const Vault = () => {
  const userData = useSelector(state => state.user.userData)
  const passwords = userData.passwords
  const dispatch = useDispatch()
 
   let token =  window.localStorage.getItem('token')
  
  // console.log(userData)
  useEffect(() => {

    fetch(`${process.env.REACT_APP_API}get-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({token : token})
    })
      .then(res => res.json())
      .then(data => {
        if(data.error){
          console.log('Token has expired')
        } else {
        dispatch(getUser(data))}
        })
      .catch(err => console.log('getuser error',err))
  }, [])

  
  let modal =  document.getElementById('modal')
  const openModal = () => {
    modal = document.getElementById('modal')
    modal.style.display = 'flex'
  }
  
  const closeModal = (event) => {
    modal =  document.getElementById('modal')
    if(event.target.id == 'modal'){

    modal.style.display = 'none'
    
    }
  }

  return (
    <div >
          
       <br/> <hr/>
      <h2 className='vault-main'>Vault</h2>
     
      <div id='modal' onClick={closeModal}>
        <ModalForm password={userData.masterPassword} email={userData.email}/>
      </div>

  
    <div style={{backgroundColor:'whitesmoke',display:'grid',gridTemplateRows:'420px 50px',}}>
      <div className='vault'>
        
        {
          passwords?
          passwords.map((password,id) => {
            
            return (
                <VaultPassword id={id} items={password} masterPassword={userData.masterPassword} email={userData.email} />
            )
          })
            
            : <div>Nothing to show...</div>
        }
    
      </div>
      
      <div style={{height:'50px',}} >
       <img src='plus.png' id="add-password-btn"  onClick={openModal}/>
    </div>
    </div>
    <Outlet/>
      </div>
  )
}

export default Vault