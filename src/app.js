const express = require('express')
const env = require('dotenv')
const app = express()

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const brandRoutes = require('./routes/brand')
const initialDataRoutes = require('./routes/admin/initialData')

const path = require('path')
const cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://Besnix:kcinnseb123@cluster0.6nh8u.mongodb.net/hax?retryWrites=true&w=majority`, 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('Database connected')
})

env.config();
app.use(cors())
app.use(express.json())
app.use('/public', express.static(path.join(__dirname, 'uploads')))
app.use('/api', authRoutes)
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', initialDataRoutes)
app.use('/api', brandRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})