const bcrypt = require('bcryptjs')

let users
let passwordManager


class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      passwordManager = await conn.db('password-manager')
      users = await conn.db('password-manager').collection("users")
      this.users = users // this is only for testing
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in UsersDAO: ${e}`,
      )
    }
  }
  static async signin(email,password){
    console.log(email,password)
    let user
    try{
      await users.find({email:email}).forEach((item) => user = item )
      console.log('Signin', user.masterPassword,password)
      let userExist = await bcrypt.compareSync(password,user.masterPassword)
      if(userExist){
        return user
      } else {
        return {error : 'Invalid credentials.'}
      }
    } catch(error){
      console.log(`Error getting user : ${error}`)
      return 
    }
  }
  static async updateUserToken(email,token){
    try{
      await users.updateOne({email:email},{$set:{token:token}})
    } catch(error) {
      console.log('Error updating token :',error)
    }
  }
   static async getUser(token){
    console.log(token)
    let user
    try{
      await users.find({token:token}).forEach((item) => user = item )
      console.log('ITEM:',user)
      return user
    } catch(error){
      console.log(`Error getting user : ${error}`)
      return 
    }
  }
  static async findUser(email){
    let user
 
    try{
      await users.find({email:email}).forEach((item) => user = item )

      if(user){
        return {error : 'Email already in use.'}
      }
      return user
    } catch(error){
      console.log('FIND user error: ', error)
    }
  }
  static async addUser(id,password,token){
    try{
    await users.insertOne({email:id, masterPassword:password,token:token,passwords:[]})
    } catch(error){
      console.error('Add user: ',error)
    }
  }
  static async addItem(email,item){
    try{
      console.log('add Item', item)
      const result = await users.updateOne({email:email},{$push:{passwords: item}},{upsert:true})
      return (result)
    } catch(error){
      console.log('AddItem : ',error)
    }
  }
  static async updateItem(email,item){
    try{
      console.log(item)
    const result = await users.updateOne({email:email},{$set:item})
    return result
    } catch(error){
      console.log('updateItem : ',error)
    }
  }
  static async removeItem(email,item){
    try{ 
      console.log('Remove item',item)
     const result =  await users.updateOne({email:email},
      {$pull:{passwords:item}})
       return result
    }catch(error){
      console.log('removeItem: ',error)
    }
  }
  static async removeUser(){
    await users.deleteOne({email:'newUser@gmail.com'})
  }
  static async changeSettings(email,oldPassword,newPassword){
    console.log(email,oldPassword,newPassword)
    let user
    try{
      await users.find({email:email}).forEach((item) => user = item )
      console.log('CHangeSettings', user.masterPassword,oldPassword)
      let passwordsMatch = await bcrypt.compareSync(oldPassword,user.masterPassword)
      if(passwordsMatch && user){
        const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(newPassword, salt)
      await users.updateOne({email:email},{$set:{masterPassword:hash}})
      return {success : 'Settings saved successfully!'}
      } else {
        return {error : 'Invalid credentials.'}
      }
    } catch(error){
      console.log(`Error getting user : ${error}`)
      return 
    }
  }
}

module.exports = UsersDAO