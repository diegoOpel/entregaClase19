import mongoose from "mongoose";

const cartCollection = "carts"

/* const productInCartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  }
})
const cartSchema = new mongoose.Schema({
  productsInCart:{
    type: [productInCartSchema],
    default: []
  } 
}) */

const cartSchema = new mongoose.Schema({

  productsInCart:{

    type: [{

      productId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'products',

        required: true

      },

      quantity: {

        type: Number,

        required: true

      }

    }],

    default: []

 }

})

export const cartModel = mongoose.model(cartCollection,cartSchema)