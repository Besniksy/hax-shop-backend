const express = require('express')
const { requireSignIn, userMiddleware } = require('../common-middleware')
const { addToCart } = require('../controllers/cart')

const router = express.Router()

router.post('/user/cart/addtocart', requireSignIn, userMiddleware, addToCart)

module.exports = router 