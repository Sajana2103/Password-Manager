const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const UsersDAO = require('./src/mongodb')
const express = require('express')
const http = require('http')
const path = require('path')
require("dotenv").config()
const router = require('./src/passwords.route')
const app = express()
const server = http.createServer(app)

const PORT =  process.env.PORT || 80
app.use(cors({
    origin: PORT,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.',  'public')))
app.use(router)
app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname, '.', 'public', 'index.html'))
})

MongoClient.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
.catch(err => {
  console.error(err.stack)
  process.exit()
})
.then(async client=>{
  await UsersDAO.injectDB(client)
  server.listen(PORT, ()=>{
  console.log("App is running on Port",PORT)
})
})



