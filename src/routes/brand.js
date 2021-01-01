const express = require('express')
const { requireSignIn, adminMiddleware } = require('../common-middleware')
const { createBrand, getBrands } = require('../controllers/brand')

const router = express.Router()


router.post('/brands/create', createBrand)
router.get('/brands', getBrands )

module.exports = router 