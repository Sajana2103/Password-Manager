
const UsersDAO = require('./mongodb')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')




const generateAccessToken = (email) => {
  return jwt.sign({ id: email }, process.env.TOKEN_KEY, { expiresIn: "600s" })
}

class PasswordsController {
  static async apiSignin(req, res, next) {
    const { email, password } = req.body
    console.log(email)
    if (!(email && password)) {
      res.status(400).send({ error: "Both email and password is required" })
    }
    try {
      const user = await UsersDAO.signin(email,password)

      console.log('apiSignin password:',password)
      if (user.email) {
        const token = generateAccessToken(email)
        user.token = token
        await UsersDAO.updateUserToken(email, token)
        // console.log('USER', user.token)
        res.status(200).json(user.token)

      } else {
        res.status(400).send(user)
      }
    } catch (error) {
      res.status(400).send({ error: "Invalid credentials" })
      console.log(error)
    }
  }
  static async apiGetUser(req, res, next) {

    const { token } = req.body
    // console.log('api get user : ', req.body)
    try {

      const user = await UsersDAO.getUser(token)
      // console.log('apigetuser:', user)

      res.json(user)
    } catch (error) {
      res.status(500).send({ error: "Username or Password is incorrect" })
      return
    }
  }
  static async apiAddUser(req, res) {
    const { email, password } = req.body
    let user = await UsersDAO.findUser(email)

      console.log('apiAddUser', password)
    if (user) {
      res.status(500).send({ error: user.error })
      return
    } else {

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const token = generateAccessToken(email)
      console.log(req.body.email, hash)
      await UsersDAO.addUser(email, hash,token)
      

        console.log('USER', token)/
        res.status(200).json(token)
      
    }
  }
  static async apiAddItem(req, res) {
    let {email,data} = req.body
    console.log('api Add item ',email,data)
    if(!data.title){
      res.status(500).json({error: 'Title is required'})
      return
    }
    let result  = await UsersDAO.addItem(email, data)
    if(result){
      console.log('apiAddItem result',result)
      res.status(200).json(result)
    } else {
      res.status(400).json({error: 'Error adding item.'})
    }
  }
  static async apiUpdateItem(req, res) {
      let {email,data} = req.body
    console.log('api Add item ',email,data)

    let result  = await UsersDAO.updateItem(email, data)
    if(result){
      console.log('apiUpdateItem result',result)
      res.status(200).json(result)
    } else {
      res.status(400).json({error: 'Error updating item.'})
    }
  }
  static async apiRemoveItem(req, res) {
    let {email,data} = req.body
    let result  = await UsersDAO.removeItem(email, data)
    if(result){
      console.log('apiRemoveItem result',result)
      res.status(200).json(result)
    } else {
      res.status(400).json({error: 'Error removing item.'})
    }
    console.log('apiRemoveItem :', data)
  }
  static async apiChangeSettings(req,res){
    let {email,oldPassword,newPassword,confirmNewPassword} = req.body
    if(newPassword === confirmNewPassword){
      
    // let response = await UsersDAO.changeSettings(email,oldPassword,newPassword)
    res.status(200).json({error:'This function is not implemented in the server.'})
    } else{
      res.status(500).json({error : 'New password and confirm new password not matching.'})
    }
  }
}

module.exports = PasswordsController