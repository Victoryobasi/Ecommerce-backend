const Category = require("../models/Category");

const createCategory = async (req, res) => {
    try {
        const { CategoryName, slug } = req.body;

        if (!CategoryName || !slug) {
            return res.status(400).json({ error: "Please provide all required fields" });
        };

        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }

        // const category = await Category.findOne({ $or: [{ CategoryName }, { slug }] });
        // if (category) {
        //     return res.status(400).json({ error: "Category already exists" });
        // }

        const category = await Category.findOne({ $or: [{ CategoryName }, { slug }] });
        if (category) {
            const message = category.CategoryName === CategoryName ? "Category name already exists" : "Category slug already exists";
            return res.status(400).json({ error: message });
        }
        
        const newCategory = await Category.create({ CategoryName, slug });
        res.status(201).json({ message: "Category created successfully", newCategory });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
        
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ category });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}
const updateCategory = async (req, res) => {
    try {

        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }

        const { CategoryName, slug } = req.body;
        const { id } = req.params;

        if (!CategoryName || !slug) {
            return res.status(400).json({ error: "Please provide all required fields" });
        };
        
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.CategoryName = CategoryName;
        category.slug = slug;
        await category.save();
        res.status(200).json({ message: "Category updated successfully", category });
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized" });
        }
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}