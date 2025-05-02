const User = require('../models/User');
const Order = require('../models/Order');

// all features of admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -__v').sort('-createdAt');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, isActive } = req.body;
        const user = await User.findByIdAndUpdate(id, { role, isActive }, { new: true }).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id).select('-password -__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'Username email').populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country').sort('-createdAt');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'Username email').populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate
(id, { status }, { new: true }).populate('user', 'Username email').populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id).populate('user', 'Username email').populate('products.product', 'name price').populate('shippingAddress', 'street city state postalCode country');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// if a user is deleted, the user should store some where in the database that
