const Product = require('../models/Product');
const Category = require('../models/Category');
// const { upload } = require('../middlewares/uploadMiddlewares')yyyyy


const createProduct = async (req, res, next) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }
        
        const { name, price, description, category, stock } = req.body;

        if (!name || !price || !description || !category || !stock) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // // check if product already exists
        // const existProducts = await Product.findOne({ name });
        // if (existProducts) {
        //     return res.status(400).json({ message: 'Product already exists' });
        // }

        // check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Category does not exist' });
        }

        // Handle multiple image uploads
        // const image = req.file ? req.file.path : null
        const images = req.files ? req.files.map(file => file.path) : [];

        if (images.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        // Create a new product
        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            images, // Store multiple image paths
            user: req.user._id
        });

        // Save the product
        const savedProduct = await product.save();
        res.status(201).json({ message: "Product created successfully", product: savedProduct });
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
        next();
    }
};

// Get all products
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('name');
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        res.status(200).json({ products });
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
};

// Get a single product

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('name');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
};

// Update a product
const updateProduct = async (req, res, next) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }

        const { name, price, description, category, stock } = req.body;
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (price) updatedFields.price = price;
        if (description) updatedFields.description = description;
        if (category) updatedFields.category = category;
        if (stock) updatedFields.stock = stock;
        if (req.files) {
            updatedFields.images = req.files.map(file => file.path);
        }
        
        const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
        res.status(200).json({ message: "product updated successfully",  product });
        next();


        // Handle file deletion for existing images

    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
};



// Delete a product
const deleteProduct = async (req, res, next) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
        next();
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}