const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phoneNO:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    orderItem:[
        {
            name:{
                type:String,
                requied:true,
            },
            quantity:{
                type:Number,
                requied:true,
            },
            image:{
                type:String,
                requied:true,
            },
            price:{
                type:Number,
                requied:true,
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                requied:true,
            },
        }
    ],
    paymentInfo:{
        id:{
            type:String,
        }
    },
    taxAmount:{
        type:Number,
        required:true
    },
    shippingAmount:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },
    deliveredAt:{
        type: Date
    },
    createdAt:{
        type:  Date,
        default: Date.now
    }
})

module.exports = mongoose.model("orders", orderSchema)