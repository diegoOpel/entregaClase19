import path from "path";
import { cartModel } from "../dao/models/cart.model.js";
import { productsModel } from "../dao/models/products.model.js";
import express from 'express';

const cartRouter = express.Router();

cartRouter.get('/:cartId', async (req,res)=>{
  const cartId = req.params.cartId
  try{
    let cart = await cartModel.find({_id: cartId}).populate("productsInCart.productId").lean()
    result = cart.productsInCart.map(product => {product.productId, product.quantity})
    cart.titulo="Cart encontrado"
    res.status(200).json({cart})
  }catch(error){
    console.log("Can't get carts with Mongoose "+error)
  }
})

cartRouter.post('/', async (req,res) => {
  let {products} = req.body
  products = JSON.parse(products)
  products.forEach(product => {
   if(!product.productId || !product.quantity){
     return res.status(400).send({status: 'error', error: 'incomplete values'})
   }
  }); 
  try{
    let cart = await cartModel.create({productsInCart: products})
    cart.titulo= "Cart agregado"
    res.status(200).render("cart",cart)
  }
  catch(error){
    console.log("Can't post carts with Mongoose"+error)
  }
})

cartRouter.delete('/:cid/products/:pid', async (req, res)=>{
  let cartId = req.params.cid;
  let productId = req.params.pid;
  try{

    let cart = await cartModel.updateOne(
      {"_id":cartId},
      {
        "$pull":{
          "productsInCart":{
            "_id": productId
          }
        }
      }
      )
    cart.titulo ="Producto borrado"
    res.status(200).render("cart",cart)
  }catch{
    console.log("Can't delete subdocs with Mongoose"+error)
  }
})

cartRouter.put('/:cid', async (req,res)=>{
  let cartId = req.params.cid;
  let {products} = req.body
  products = JSON.parse(products)
  products.forEach(product => {
   if(!product.productId || !product.quantity){
     return res.status(400).send({status: 'error', error: 'incomplete values'})
   }
  }); 
  try{
    let cart = await cartModel.findById(cartId)
    cart.productsInCart = products 
    cart.titulo ="Carrito actualizado"
    await cartModel.findByIdAndUpdate(cartId, cart)
    res.status(200).render("cart",cart)
  }catch{
    console.log("Can't put subdocs with Mongoose"+error)
  }
})

cartRouter.put('/:cid/products/:pid', async (req,res)=>{
  let cartId = req.params.cid;
  let productId = req.params.pid;
  let {quantity} = req.body
   
  try{
    let cart = await cartModel.findById(cartId)
    let productIndex = cart.productsInCart.findIndex(product => product.productId == productId) 
    console.log(cart.productsInCart)
    cart.productsInCart[productIndex].quantity = quantity
    cart.titulo ="Carrito actualizado"
    await cartModel.findByIdAndUpdate(cartId, cart)
    res.status(200).render("cart",cart)
  }catch{
    console.log("Can't put subdocs with Mongoose"+error)
  }
})

cartRouter.put('/:cid', async (req,res)=>{
  let cartId = req.params.cid;
  let {products} = req.body
  products = JSON.parse(products)
  products.forEach(product => {
   if(!product.productId || !product.quantity){
     return res.status(400).send({status: 'error', error: 'incomplete values'})
   }
  }); 
  try{
    let cart = await cartModel.findById(cartId)
    cart.productsInCart = products 
    cart.titulo ="Carrito actualizado"
    await cartModel.findByIdAndUpdate(cartId, cart)
    res.status(200).render("cart",cart)
  }catch{
    console.log("Can't put subdocs with Mongoose"+error)
  }
})

cartRouter.delete('/:cid/', async (req,res)=>{
  let cartId = req.params.cid;
   
  try{
    let cart = await cartModel.findById(cartId)
    cart.productsInCart = []
    cart.titulo ="Carrito actualizado"
    await cartModel.findByIdAndUpdate(cartId, cart)
    res.status(200).render("cart",cart)
  }catch{
    console.log("Can't put subdocs with Mongoose"+error)
  }
})
export default cartRouter