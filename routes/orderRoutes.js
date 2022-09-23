const express = require('express')
const router = express.Router()

const {createOrder, getOneOrder, getLoggedInOrder, adminUpdateOrders, adminDeleteOrder} = require('../controllers/orderController')
const { isLoggedIn, customRole } = require('../middlewares/user')


router.route('/order/create').post(isLoggedIn, createOrder)
router.route('/order/:id').get(isLoggedIn, getOneOrder)
router.route('/myorder').get(isLoggedIn, getLoggedInOrder)


//admin
router.route('/admin/orders').get(isLoggedIn,customRole('admin'), getLoggedInOrder)
router.route('/admin/order/:id').put(isLoggedIn,customRole('admin'), adminUpdateOrders)
router.route('/admin/order/:id').delete(isLoggedIn,customRole('admin'), adminDeleteOrder)

module.exports = router