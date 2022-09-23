const bigPromise = require('../middlewares/bigPromise')
const stripe = require("stripe")(process.env.STRIPE_SECRET);


exports.sendStripeKey = bigPromise(async( req, res, next) => {


    res.status(200).json({
        stripeKey:process.env.STRIPE_KEY
    })
})

exports.captureStripePayment = bigPromise(async( req, res, next) => {


    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",


        metadata:{integration_check: "accept_payment"}
       
      });


    res.status(200).json({
       success:true,
       client_secret:paymentIntent.client_secret,
       amount:req.body.amount,

    })
})

exports.sendRazorKey = bigPromise(async( req, res, next) => {

    var instance = new Razorpay({ 
        key_id: process.env.RAZOR_KEY, 
        key_secret: process.env.RAZOR_SECRET })

       res.status(200).json({
        key_id: process.env.RAZOR_KEY, 

       })
})

exports.captureRazorPayment = bigPromise(async( req, res, next) => {

    var instance = new Razorpay({ 
        key_id: process.env.RAZOR_KEY, 
        key_secret: process.env.RAZOR_SECRET })

    var options={
        amount:req.body.amount,
        currency:'INR',
        
    }

    const myOrder = await instance.orders.create(options)

       res.status(200).json({
        success:true,
        amount:req.body.amount,
        order:myOrder


       })
})