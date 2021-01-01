const Brand = require('../models/brand')


exports.createBrand = (req, res) => {
    // res.status(200).json({ file: req.files, body: req.body})

    const {
        name
    } = req.body
     
    const brand = new Brand({
        name
    })

    brand.save(((error, brand) => {
        if(error) return res.status(400).json({ error })
        if(brand){
            res.status(201).json({ brand })
        }
    }))
}

exports.getBrands = (req, res) => {
    Brand.find({})
    .exec((error, brands)=> {
        if(error) return res.status(400).json({error})
        if(brands){
            return res.status(200).json({brands})
        }
    })
}