const User = require('../models/userModel.js')
const bigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError')
const cookieToken = require('../utils/cookieToken.js')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')
const mailHelper = require('../utils/emailHelper.js')
const crypto = require('crypto')

exports.signup = bigPromise( async (req,res, next) => {



if(!req.files){
    return next(new CustomError("Photo is required for signup",400))
}


const { name, email, password} = req.body

if(!email || !name || !password){
    return next( new CustomError('Name, Email, Password are required', 400))
}


    let file = req.files.photo
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
        folder:"users",
        crop:"scale"
    })


   

    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id:result.public_id,
            secure_url: result.secure_url
        }
    })

   cookieToken(user, res)
})

exports.login = bigPromise( async (req,res , next) => {
    const {email , password} = req.body

    //check for email and password

    if (!email || !password){
        return next( new CustomError("Please provide email and paasword", 400))
    }
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next( new CustomError("user is not registerd", 400))
    }

    
    // matching password
    const isPassCorrect = await user.isValidatePass(password)
    
    if(!isPassCorrect){
        return next( new CustomError("Email or password does not match or exists", 400))
    }

    cookieToken(user, res)
})

exports.logout = bigPromise( async (req,res , next) => {
    
   res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly:true,

   })
   res.status(200).json({
    success:true,
    message:"Logout Success"
   })
})

exports.forgotPass = bigPromise( async (req,res , next) => {
    
    const {email} = req.body

    const user= await User.findOne({email})

    if(!user){
        return next(new CustomError('Email is not registered', 400))
    }

    const forgotToken = user.getForgotPassToken()

    await user.save({validateBeforeSave: false})

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    const message = `copy paste this link and hit enter \n\n ${myUrl}`

    try {
        await mailHelper({
            email: user.email,
            subject:'Abhii Store - Password reset email',
            message,
        })

        res.status(200).json({
            success:true,
            message:"Email sent successfully"
        })
        
    } catch (error) {
        user.forgotPassToken = undefined
        user.forgotPassExpiry= undefined
        await user.save({validateBeforeSave: false})

        return next( new CustomError(error.message,500))

    }
})

exports.passwordReset = bigPromise( async (req,res , next) => {

    const token = req.params.token

    const encryToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    const user = await User.findOne({
        encryToken,
        forgotPassExpiry: {$gt: Date.now()}
    })

    if(!user){
        return next(new CustomError('Token is expired or invalid',400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new CustomError('Both paasword do not match',400))

    }

    user.password= req.body.password

    user.forgotPassToken = undefined
    user.forgotPassExpiry= undefined
    await user.save()

    //send json res or token

    cookieToken(user, res)

})

exports.loggedInUserDetails = bigPromise( async (req,res , next) => { 

    const user= await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user,
    })
})

exports.changePassword = bigPromise( async ( req, res, next) => {

    const userId = req.user.id

    const user= await User.findById(userId).select("+password")

    const isCorrectOldPass = await user.isValidatePass(req.body.oldPassword)

    if(!isCorrectOldPass){
        return next(new CustomError("Old password is incorrect", 400))

    }
    user.password = req.body.password
    await user.save()

    cookieToken(user,res)
})

exports.updateUserDetails = bigPromise( async ( req, res, next) => {

    const newData ={
        name: req.body.name,
        email:req.body.email
    }

    if(req.files){
       const user = await User.findById(req.user.id)

       const imgId= user.photo.id

       // delete photo from cloudinary
       const resp = await cloudinary.v2.uploader.destroy(imgId)

       //upload new photo onn cloudinary
       const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath,{
           folder:"users",
           width:150,
           crop:"scale"
       })

       //storing data of new photo
       newData.photo={
        id:result.public_id,
        secure_url:result.secure_url
       }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true
    })

})

exports.adminAllUser = bigPromise( async ( req, res, next) => {

    const users = await User.find()
    res.status(200).json({
        success:true,
        users
    })
})

exports.adminGetOneUser= bigPromise(async(req, res, next) => {
    const user = User.findById(req.params.id)

    if(!user){
        next(new CustomError("No user found", 400))
    }

    res.status(200).json({
        success:true,
        user,
    })
})


exports.managerAllUser = bigPromise( async ( req, res, next) => {

    const users = await User.find({role:"user"})
    res.status(200).json({
        success:true,
        users
    })
})

exports.adminUpdateOneUserDetail = bigPromise( async ( req, res, next) => {

    const newData ={
        name: req.body.name,
        email:req.body.email,
        role: req.body.role
    }



    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
        user,
    })

})

exports.adminDeleteUser = bigPromise( async ( req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return next(new CustomError(" No user found", 401))
    }

    const imgId= user.photo.id

    // delete photo from cloudinary
    const resp = await cloudinary.v2.uploader.destroy(imgId)

    await user.remove()


    res.status(200).json({
        success:true,
    })
})
