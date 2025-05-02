const express = require('express');
const router = express.Router();




const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const categoryRoutes = require('./categoryRoutes');
// const addressRoutes = require('./addressRoutes');
const addressRoutes = require('./addressRoutes')
const orderRoutes = require('./orderRoutes');


router.use('/auth', authRoutes);

router.use('/products', productRoutes);

router.use('/categories', categoryRoutes);

router.use('/cart', cartRoutes);

router.use('/address', addressRoutes);

router.use('/orders', orderRoutes);

module.exports = {
    setRoutes: (app) => {
        app.use('/api', router);
    console.log('Api routes')
    }
}