const Category = require('../models/category')
const slugify = require('slugify')
const category = require('../models/category');
const Product = require('../models/product');

function createCategories(categories, parentId = null){
    const categoryList = []
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined)
    }else{
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            categoryImage: cate.categoryImage,
            children: createCategories(categories, cate._id)
        })
    }

    return categoryList
}

exports.addCategory = (req, res) => {

    let categoryUrl
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    }

    if(req.file){
        categoryUrl = 'http://localhost:5000/public/' + req.file.filename
        categoryObj.categoryImage = categoryUrl
    }

    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId
    }

    const cat = new Category(categoryObj)
    cat.save((error, category) => {
        if(error) return res.status(400).json({ error })
        if(category){
            return res.status(201).json({ category })
        }
    } )
}

exports.getCategories = (req, res) => {
    Category.find({})
    .exec((error, categories)=> {
        if(error) return res.status(400).json({error})
        if(categories){

            const categoryList = createCategories(categories)
            return res.status(200).json({categoryList})
        }
    })
}

exports.getProductsFromCategories = (req, res) => {
    const { cate } = req.params;
    Category.findOne({ slug: cate})

    .exec((error, categories)=> {
        if(error) return res.status(400).json({error})
        if(categories){
            const categoryList = createCategories(categories)
            return res.status(200).json({categoryList})
        }
    })
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug }).exec((error, category) => {
      if (!category) {
        // return res.status(400).json({ error });
        return res.status(200).json({ products: [] });
      }
  
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (products.length == 0) {
            return res.status(200).json({ products: [] });
          }
  
          if (products.length > 0) {
            res.status(200).json({ products });
          }
        });
      }
    });
  };