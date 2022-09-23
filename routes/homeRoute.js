const express = require('express')
const router = express.Router()

const { home } = require('../controllers/homController')

router.route('/').get(home)



module.exports = router