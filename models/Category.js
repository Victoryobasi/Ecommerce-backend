const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    CategoryName: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);