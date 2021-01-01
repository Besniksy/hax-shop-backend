const Product = require("../models/product");
const shortId = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const category = require("../models/category");
const { v4: uuidv4 } = require("uuid");

exports.createProduct = (req, res) => {
  // res.status(200).json({ file: req.files, body: req.body})

  const {
    id,
    name,
    price,
    shortDescription,
    fullDescription,
    category,
    quantity,
    discount,
    newProduct,
    stock,
    brand,
  } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  let tagsArray = [];
  discount > 0 ? tagsArray.push("sale") : tagsArray == null;
  newProduct === "true" ? tagsArray.push("new") : tagsArray == null;

  const product = new Product({
    id: uuidv4(),
    name,
    slug: slugify(name),
    price,
    newProduct,
    discount,
    shortDescription,
    fullDescription,
    productPictures,
    category,
    brand,
    quantity,
    stock,
    tag: tagsArray,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getAllProducts = (req, res) => {
  Product.find({})
    .populate({ path: "category", select: "_id name parentId" })
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        return res.status(200).json({ products });
      }
    });
};

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

exports.getProductsByMainCategory = (req, res) => {
  const { cate } = req.params;
  Category.findOne({ slug: cate }).exec((error, category) => {
    if (!category) {
      return res.status(200).json({ products: [] });
    }

    if (category) {
      Product.find({})
        .populate({ path: "category", select: "_id name parentId" })
        .exec((error, products) => {
          if (error) return res.status(400).json({ error });
          if (products) {
            let requiredProducts = products.filter(
              (prod) => prod.category.parentId == category._id
            );
            return res.status(200).json({ products: requiredProducts });
          }
        });
    }
  });
};

exports.getProductsByMainCategoryAndSearch = (req, res) => {
  const { cate } = req.params;
  const searchedField = req.query.name;
  Category.findOne({ slug: cate }).exec((error, category) => {
    if (!category) {
      return res.status(200).json({ products: [] });
    }

    if (category) {
      Product.find({name: { $regex: searchedField, $options: "$i" }})
        .populate({ path: "category", select: "_id name parentId" })
        .exec((error, products) => {
          if (error) return res.status(400).json({ error });
          if (products) {
            let requiredProducts = products.filter(
              (prod) => prod.category.parentId == category._id
            );
            return res.status(200).json({ products: requiredProducts });
          }
        });
    }
  });
};

exports.getProductsBySearch = (req, res) => {
  const searchedField = req.query.name;
  const { search } = req.params;

  Category.findOne({ slug: search }).exec((error, category) => {
    if (!category) {
      return res.status(200).json({ products: [] });
    }
    if (category) {
      Product.find({
        category: category._id,
        name: { $regex: searchedField, $options: "$i" },
      }).exec((error, products) => {
        if (!products) return res.status(200).json([]);

        if (products.length > 0) {
          res.status(200).json({ products });
        } else {
          res.status(200).json({ products: [] });
        }
      });
    }
  });
};

exports.getAllProductsBySearch = (req, res) => {
  const searchedField = req.query.name;
  const { search } = req.params;

  Product.find({
    name: { $regex: searchedField, $options: "$i" },
  })
    .populate({ path: "category", select: "_id name" })
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });

      if (products.length > 0) {
        res.status(200).json({ products });
      } else {
        res.status(200).json({ products: [] });
      }
    });
};
