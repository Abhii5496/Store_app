const bigPromise = require('../middlewares/bigPromise')
const Product = require('../models/productModel')
const CustomError = require('../utils/customError')
const cloudinary = require('cloudinary')
const whereClause = require('../utils/whereClause')


exports.addProduct= bigPromise(async(req, res, next) =>{ 
    
    //imagses
    let imgArray =[]

    if(!req.files){
        return next( new CustomError("images are required", 401))
    }

    if(req.files){
        for (let index = 0; index < req.files.photos.length; index++) {
            

            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder:"products"
            })

            imgArray.push({
                id: result.public_id,
                secure_url:result.secure_url
            })
        }

    }

    req.body.photos = imgArray
    req.body.user = req.user.id

    const product= await Product.create(req.body)

    res.status(200).json({
        success:true,
        product,
    })

})


exports.getAllAproduct = bigPromise(async(req, res, next) =>{

    const resultPerPage = 6
    const totalcountProduct = await Product.countDocuments()

    const productObj = new whereClause(Product.find(), req.query).search().filter()

    let products= await productObj.base.clone()
        // const products = Product.find({})

    const filteredProductNumber =  products.length

    productObj.pager(resultPerPage)
     products= await productObj.base


    res.status(200).json({
        success:true,
        products,
        filteredProductNumber,
        totalcountProduct
    })
})

exports.adminGetAllAproduct = bigPromise(async(req, res, next) =>{
 
    const products= await Product.find()

    if(!products){
        return next( new CustomError ("No product available", 401))
    }


    res.status(200).json({
        success:true,
        products,
    })
})

exports.getOneProduct = bigPromise(async(req, res, next) =>{

    const product = await Product.findById(req.params.id)

    if(!product){
        return next( new CustomError(" No product found with this id" , 401))
    }

    res.status(200).json({

        success:true,
        product
    })
})

exports.adminUpdateOneProduct = bigPromise(async(req, res, next) =>{

    let product = await Product.findById(req.params.id)

    if(!product){
        return next( new CustomError(" No product found with this id" , 401))
    }

    imgArray= []

    //destroy the existing img

    if(req.files){
        for (let index = 0; index < product.photos.length; index++) {
         const result= await  cloudinary.v2.uploader.destroy(product.photos[index].id)
        }
    }

    
        for (let index = 0; index < req.files.photos.length; index++) {
            

            let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{

                folder:"products"
            })

            imgArray.push({
                id: result.public_id,
                secure_url:result.secure_url
            })
        }

    

    req.body.photos = imgArray

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true,
        useFindAndModify: false
    })

    

    res.status(200).json({
        success:true,
        product,
})
})

exports.adminDeleteOneProduct = bigPromise(async(req, res, next) =>{

    const product = await Product.findById(req.params.id)

    if(!product){
        return next( new CustomError(" No product found with this id" , 401))
    }

   

    for (let index = 0; index < product.photos.length.length; index++) {
    
     const result= await  cloudinary.v2.uploader.destroy(product.photos[index].id)
    }
    
   await product.remove()

    
    

    res.status(200).json({
        success:true,
        message:"Product was Deleted !!",
})
})


exports.addReview = bigPromise(async(req, res, next) => {

    const {rating, comment, productId} = req.body

    const review ={
        user: req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comment,
    }

    const product = await Product.findById(productId)

    const alreadyReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if(alreadyReviewed){
        product.review.forEach((review) => {
        if(rev.user.toString() === req.user._id.toString()){
            review.comment = comment
            review.rating = rating

        }
        })

    } else {
        product.reviews.push(review)
        product.noOfReview = product.reviews.length
    }

    //adjust ratings

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    // save

    await product.save({validateBeforeSave: false})

    res.status.json({
        success: true
    })
})

exports.deleteReview = bigPromise(async(req, res, next) => {

    const { productId} = req.query

    const product = await Product.findById(productId)

    const reviews = product.reviews.filter(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    const noOfReview = reviews.length

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    //update product

    await Product.findByIdAndUpdate(productId, {
        reviews,
        ratings,
        noOfReview
    }, {
        new: true,
        runValidators:true,
        useFindAndModify:false,
    })




    res.status.json({
        success: true
    })

})

exports.getReviewsOneProduct = bigPromise(async(req, res, next) => {


    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })

})