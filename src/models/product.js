const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },

    brand: [
        {type: String}    
    ],
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number
    },
    newProduct: {
        type: Boolean
    },
    stock: {
        type: Number,
        required: true
    },
    shortDescription: {
        type: String,
        trim: true
    },
    fullDescription: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productPictures: [
        { img: {type: String }}
    ],
    tagSale: {
        type: String
    },
    tagNew: {
        type: String
    },
    tag: [
        {type: String}
    ],
    reviews: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            review: String
        }
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    // brand: [{type: mongoose.Schema.Types.String, ref: 'Brand'}]
}, { timestamps: true})

module.exports = mongoose.model('Product', productSchema)