const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        // min: [0, 'Price cannot be negative'],
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        // min: [0, 'Stock cannot be negative'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required'],
    },
    images: [{
        type: String,
        // match: [/^https?:\/\/[^\s]+$/, 'Invalid image URL'],
    }],
}, {
    timestamps: true,
    // toJSON: {
    //     virtuals: true,
    // },
    // toObject: {
    //     virtuals: true,
    // },
});

module.exports = mongoose.model('Product', ProductSchema);