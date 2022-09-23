const bigPromise = require('../middlewares/bigPromise')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const CustomError = require('../utils/customError')


exports.createOrder = bigPromise(async ( req,res, next ) => {

    const {shippingInfo,orderItem,paymentInfo,taxAmount, shippingAmount,totalAmount} = req.body

    Order.create({
        shippingInfo,orderItem,paymentInfo,taxAmount, shippingAmount,totalAmount,
        User:req.user._id
    })
    res.status(200).json({
        success: true,
        Order
    })
})

exports.getOneOrder = bigPromise(async ( req,res, next ) => {

    const order = await Order.findById(req.params.id).populate('user', 'name', 'email')

    if(!order){
        return next( new CustomError(" Order not Found, please check orderID", 401))
    }


    res.status(200).json({
        success: true,
        order
    })
})


exports.getLoggedInOrder = bigPromise(async ( req,res, next ) => {

    const order = await Order.findById({user: req.user._id})

    if(!order){
        return next( new CustomError(" Order not Found, please check orderID", 401))
    }


    res.status(200).json({
        success: true,
        order
    })
})

exports.adminGetAllOrders = bigPromise(async ( req,res, next ) => {

    const orders = await Order.find()

    res.status(200).json({
        success: true,
        orders
    })
})

exports.adminUpdateOrders = bigPromise(async ( req,res, next ) => {

    const order = await Order.findById(req.params.id)

    if(order.orderStatus === "Delivered") {
        return next( new CustomError( "Order is already Delivered", 401))
    }

    order.orderStatus = req.body.orderStatus

    order.orderItem.forEach( async prod => {
       await updateProductStock(prod.product, prod.quantity)
    })

    await order.save()

    res.status(200).json({
        success: true,
        order
    })
})
exports.adminDeleteOrder = bigPromise(async ( req,res, next ) => {

    const order = await Order.findById(req.params.id)


    await order.remove()

    res.status(200).json({
        success: true,
        message:"Order deleted Succesfully"
    })
})

async function updateProductStock(productId, quantity){
    const product = await Product.findById(productId)

    product.stock=  product.stock - quantity

    await product.save({ validateBeforeSave: false})
}