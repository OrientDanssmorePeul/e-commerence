const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }
  ]
});

const Cart  = model('Cart', cartSchema)
module.exports = Cart