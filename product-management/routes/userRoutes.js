
// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../model/User");

// 1. Specific/Static routes first to avoid ID collisions
router.post("/newUser", async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Validation failed", error: error.message });
    }
});

router.post("/post", async (req, res) => {
    try {
        const user = await User.findOne({name: req.body.name, email: req.body.email, password: req.body.password});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;