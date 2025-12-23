
// module.exports = router;
const express = require("express");
const router = express.Router();
const Category = require("../model/Category");

// 1. Specific/Static routes first to avoid ID collisions
router.post("/newCategory", async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: "Validation failed", error: error.message });
    }
});

router.get("/getAll", async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        // Added { new: true } so 'product' contains the UPDATED version
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

router.delete("/remove/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if(!category){
            return res.status(404).json({ message: "Product already deleted" });
        }
        res.json({ message: "Product removed", category });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
});

module.exports = router;