import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {},
    token:''
  },
  reducers: {
    getToken: (state,action) => {
 
      state.token = action.payload
    },
    getUser:(state,action) =>{
      state.userData = action.payload
    },
    addItem:(state,action) => {
      console.log('Adding item reducer fires',action.payload)
      state.userData.passwords.push(action.payload)
    },
    updatePasswordItem:(state,action) => {
      const {id,data} = action.payload
     state.userData.passwords[id] = data
   
    },
    removePasswordItem(state,action){
       const {id} = action.payload
   
      state.userData.passwords = state.userData.passwords.filter((password,idx) => idx !== id)

    },
    logout: state => {
    state.token = ''
    state.userData = {}
    },
    testDispatch(state,action){
   
      const {id} = action.payload
   
      state.userData.passwords = state.userData.passwords.filter((password,idx) => idx !== id)

    }
    
  }
})

export const { getToken,getUser, logout,addItem ,updatePasswordItem,removePasswordItem,testDispatch} = userSlice.actions

export default userSlice.reducer