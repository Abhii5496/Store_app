const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')




const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,  "Please provide a name"],
        maxlength: [40, 'Name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true,  "Please provide a email"],
        validate: [validator.isEmail, 'Please enter email in correct format'],
        unique: [true, 'This email is already used']
    },
    password: {
        type: String,
        required: [true,  "Please provide a password"],
        minlength: [6, 'Password should be atleast 6 characters'],
        select: false
    },

    role:{
        type:String,
        default: 'user'
    },
    photo:{
        id:{
            type:String,
            // required:true
        },
        secure_url:{
            type:String,
            // required:true
        }
    },

    forgotPassToken:String,
    forgotPassExpiry:Date,
    createdAt:{
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isValidatePass = async function(userSendPass){
    return await bcrypt.compare(userSendPass, this.password)
}

// create and return jwt token

userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY})
}
//generate forgot paasowd 

userSchema.methods.getForgotPassToken = function(){
    const forgotToken = crypto.randomBytes(20).toString('hex')
    this.forgotPassToken = crypto.createHash('sha256').update(forgotToken).digest('hex')

    this.forgotPassExpiry= Date.now() +20 *60*1000

    return forgotToken
}

module.exports = mongoose.model('user', userSchema)