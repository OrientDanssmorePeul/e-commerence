const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart");

router.post("/newCart", async (req, res) => {
    try {
        const { user, products } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ user });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ user, products });
        } else {
            // Update existing cart
            products.forEach((newProduct) => {
                const existingProduct = cart.products.find(
                    (p) => p.productId.toString() === newProduct.productId
                );
                if (existingProduct) {
                    // If product exists, increment quantity
                    existingProduct.quantity += newProduct.quantity;
                } else {
                    // If not, add the product
                    cart.products.push(newProduct);
                }
            });
        }

        const savedCart = await cart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(400).json({ message: "Validation failed", error: error.message });
    }
});

router.get("/getCart", async (req, res) => {
    try {
        const { user } = req.query;
        let cart = await Cart.findOne({ user }).populate("user", "name email");
        if (!cart) {
            // Return a default empty cart instead of 404
            return res.json({ user, products: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// router.get("/get", async (req, res) => {
//     try {
//         const cart = await Cart.find()
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// })

router.delete("/deleteCartByUser/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        res.json({ message: "Cart deleted", cart });
    } catch (err) {
        res.status(500).json({ message: "Error deleting cart", error: err.message });
    }
})

// router.delete("/deleteAllCarts", async (req, res) => {
//     try {
//         const result = await Cart.deleteMany({}); // deletes all documents in Cart collection
//         res.status(200).json({
//             message: "All carts deleted successfully",
//             deletedCount: result.deletedCount
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Failed to delete carts",
//             error: error.message
//         });
//     }
// });
module.exports = router;