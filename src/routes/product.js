const express = require('express')
const { requireSignIn, adminMiddleware } = require('../common-middleware')
const { createProduct, getProductsBySlug, getProductsBySearch, getAllProducts, getAllProductsBySearch, getProductsByMainCategory, getProductsByMainCategoryAndSearch } = require('../controllers/product')
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage })

router.post('/product/create', requireSignIn, adminMiddleware, upload.array('productPicture'), createProduct)
router.get('/productssearch/:search', getProductsBySearch )
router.get('/products/:slug', getProductsBySlug )
router.get('/productsbycategory/:cate', getProductsByMainCategory )
router.get('/productsbycategoryandsearch/:cate', getProductsByMainCategoryAndSearch )
router.get('/products', getAllProducts )
router.get('/allproducts', getAllProductsBySearch )

module.exports = router 