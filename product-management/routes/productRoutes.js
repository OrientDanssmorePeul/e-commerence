
// module.exports = router;
const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

// 1. Specific/Static routes first to avoid ID collisions
router.get("/specific", async (req, res) => {
    try {
        const product = await Product.find({ category: req.query.category });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching category" });
    }
});

router.post("/newProduct", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Validation failed", error: error.message });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2. Dynamic ID routes last
router.get("/get/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Invalid ID format" });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        // Added { new: true } so 'product' contains the UPDATED version
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

router.delete("/remove/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product already deleted" });
        }
        res.json({ message: "Product removed", product });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
});

module.exports = router;