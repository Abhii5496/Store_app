const express = require ('express')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middlewares/user')
const {sendRazorKey,sendStripeKey, captureRazorPayment,captureStripePayment} = require('../controllers/paymentController')




router.route('/stripekey').get(isLoggedIn, sendStripeKey)
router.route('/razorkey').get(isLoggedIn, sendRazorKey)


router.route('/stripePayment').post(isLoggedIn, captureStripePayment)
router.route('/razorPayment').post(isLoggedIn, captureRazorPayment)




module.exports = router
