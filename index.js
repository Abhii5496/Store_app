require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')
const cloudinary = require('cloudinary')


//connect with database
connectDB()

//cloudinary setup

cloudinary.config({
   cloud_name:process.env.C_NAME,
   api_key:process.env.C_KEY,
   api_secret:process.env.C_SECRET
})


app.listen(process.env.PORT, (req,res) =>{
   console.log( `Server is running on : ${process.env.PORT}`)
})