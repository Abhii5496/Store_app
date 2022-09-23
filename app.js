require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');



app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:'/tmp/'
}))


//morgan middleware
app.use(morgan("tiny"))

const home = require('./routes/homeRoute') 
const signup = require('./routes/userRoute') 
const product = require('./routes/productRoute')
const payment = require('./routes/payment')
const order = require('./routes/orderRoutes')




app.use('/api/v1', home)
app.use('/api/v1', signup)
app.use('/api/v1', product)
app.use('/api/v1', payment)
app.use('/api/v1', order)

module.exports= app