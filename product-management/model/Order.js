const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const orderSchema = new Schema({
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
  ],
  
  status: {
    type: String,
    default: "Pending"
  },

  paymentDate: Date
}, { timestamps: true });

const Order  = model('Order', orderSchema)
module.exports = Order