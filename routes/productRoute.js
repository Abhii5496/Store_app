const express = require('express')
const router = express.Router()

const {addProduct, getAllAproduct, adminGetAllAproduct, getOneProduct, adminUpdateOneProduct, adminDeleteOneProduct, addReview, deleteReview, getReviewsOneProduct} = require('../controllers/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')


//user

router.route('/products').get(getAllAproduct)
router.route('/product/:id').get(getOneProduct)
router.route('/review').put(addReview)
router.route('/review').delete(isLoggedIn,deleteReview)
router.route('/reviews').get(getReviewsOneProduct)



//admin
router.route('/admin/product/add').post(isLoggedIn, customRole("admin"), addProduct)
router.route('/admin/products').get(isLoggedIn, customRole("admin"), adminGetAllAproduct)
router.route('/admin/product/:id').put(isLoggedIn, customRole("admin"), adminUpdateOneProduct)
router.route('/admin/product/:id').delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct)


module.exports = router