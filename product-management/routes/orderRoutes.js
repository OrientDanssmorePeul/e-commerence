const express = require("express");
const router = express.Router();
const Order = require("../model/Order");

router.post("/newOrder", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: "Validation failed", error: error.message });
    }
});

router.get("/getOrder", async (req, res) => {
    try {
        const order = await Order.find({user: req.query.user}).populate("user", "name email")
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/remove/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;