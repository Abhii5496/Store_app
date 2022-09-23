const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, "please provide product name"],
        trim:true,
        maxlength:[120, "product name should not exceed 120 Characters"],
    },
    price:{
        type:Number,
        required:[true, "please provide product price"],
        maxlength:[5, "product price should not exceed 5 Characters"],
    },
    description:{
        type:String,
        required:[true, "please provide product description"],
    },
    photos:[
        {
        id:{
            type:String,
            required:true, 
        },
        secure_url:{
            type:String,
            required:true,
        }
    }
    ],
    category:{
        type:String,
        required:[true, "please provide product Category from  shortsleeves,longsleeves, sweatshirt,hoodies"],
        enum:{
            values: [
                'short-sleeves',
                'long-sleeves',
                'sweat-shirt',
                'hoodies'
            ]
        },
        message:
        "please provide product Category from  shortsleeves,longsleeves, sweatshirt,hoodies"
    },
    brand:{
        type:String,
        required:[true, "please add brand name"]
    },
    stock:{
        type:Number,
        required: [true, "please add a number in stock"]
    },
    ratings:{
        type:Number,
        default:0
    },
    noOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports= mongoose.model('product', productSchema)