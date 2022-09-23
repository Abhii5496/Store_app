const express = require('express')
const router = express.Router()

const {signup, login, logout, forgotPass,
     passwordReset, loggedInUserDetails,
     changePassword, updateUserDetails,
     adminAllUser,
     managerAllUser,
     adminGetOneUser,
     adminUpdateOneUserDetail,
     adminDeleteUser
    
    } = require('../controllers/userController')

const { isLoggedIn, customRole } = require('../middlewares/user')



router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPass').post(forgotPass)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userDashboard').get(isLoggedIn,loggedInUserDetails)
router.route('/password/update').post(isLoggedIn,changePassword)
router.route('/userDashboard/update').post(isLoggedIn,updateUserDetails)


router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUser)
router.route('/admin/user/:id')
.get(isLoggedIn, customRole('admin'), adminGetOneUser)
.put(isLoggedIn, customRole('admin'), adminUpdateOneUserDetail)
.delete(isLoggedIn, customRole('admin'), adminDeleteUser)  




router.route('/manager/users').get(isLoggedIn, customRole('manager'), managerAllUser)
    
   


module.exports = router