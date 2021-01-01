const express = require('express')
const { requireSignIn, adminMiddleware } = require('../common-middleware')
const { addCategory, getCategories, getProductsFromCategories } = require('../controllers/category')

const router = express.Router()
const multer = require('multer')
const shortid = require('shortid')
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage })

router.post('/category/create', requireSignIn, adminMiddleware, upload.single('categoryImage'), addCategory)

router.get('/category/getcategories', getCategories)
router.get('/category/getprodbycat/:cate', getProductsFromCategories)

module.exports = router 