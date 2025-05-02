

// create an order
const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod } = req.body;

        if (!products || !products.length || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Missing required order fields' });
        }

        // Fetch all products from DB and calculate total
        const productIds = products.map(p => p.product);
        const dbProducts = await Product.find({ _id: { $in: productIds } });

        let totalAmount = 0;
        const validatedProducts = [];

        products.forEach(item => {
            const dbProduct = dbProducts.find(p => p._id.toString() === item.product);
            if (!dbProduct) throw new Error(`Product not found: ${item.product}`);

            totalAmount += dbProduct.price * item.quantity;

            validatedProducts.push({
                product: dbProduct._id,
                quantity: item.quantity
            });
        });

        // Stripe: Create payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Stripe needs amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
            receipt_email: req.user.email,
        });

        // Save order after successful paymentIntent
        const newOrder = new Order({
            user: req.user._id,
            products: validatedProducts,
            totalAmount,
            status: 'place your order',
            shippingAddress,
            paymentMethod,
        });
        //pi_3RJcRVHKVW9H3YmK1E6UewTa

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder,
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};


// Get all orders for a user
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
}