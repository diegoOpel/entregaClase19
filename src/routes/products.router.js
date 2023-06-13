import express from "express"
import { productsModel } from "../dao/models/products.model.js"
const productsRouter = express.Router()

productsRouter.get('/', async (req,res)=>{
  let limit = req.query.limit
  let page = req.query.page
  let query = req.query.query
  let sortBy = req.query.sortBy
  try{
    let products = {}
    if(!limit) limit= 10
    if(!page) page=1;
    if(!sortBy) sortBy="asc";
    if(query){
      products = await productsModel.paginate({"category": `${query}`},{page: page, limit: limit, sort:{_id:1, price: sortBy} , lean: true})
    }else{
      products = await productsModel.paginate({},{page: page, limit: limit, sort:{_id:1, price: sortBy} , lean: true})
    }
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/?page=${products.prevPage}` : "";
    products.nextLink = products.hasNextPage ? `http://localhost:8080/?page=${products.nextPage}` : "";
    products.isValid = !(page<=0 || page > products.totalDocs)
    products.titulo = "Productos";
    if(req.session.user){
      products.first_name = req.session.user.first_name 
    }else{
      products.first_name = false
    }
    console.log(products)
    res.status(200).render('index',products)
  }
  catch(error){
    console.log("Can't get products with Mongoose"+error)
  }
});

productsRouter.get('/:productId', async (req, res)=>{
  const productId = req.params.productId
  try{
    let product = await productsModel.findById(productId).lean();
    res.status(200).render('index',{titulo:"Producto individual",products: [product]})
  }
  catch(error){
    console.log("Can't get products with Mongoose "+error)
  }
})

productsRouter.post('/', async (req, res)=>{
  let {title, description, code, price, status, stock, category, thumbnails} = req.body
  if(!title || !description || !price || !stock || !category || !code || !thumbnails || !status){
    return res.status(400).send({status: 'error', error: 'incomplete values'})
  }
  try{
    let result = await productsModel.create({
      title, description, code, price, status, stock, category, thumbnails
    })
    res.status(200).render('index',{titulo:"Productos agregado",products: result})
  }
  catch(error){
    console.log("Can't post products with Mongoose"+error)
  }
})

productsRouter.put('/:productId', async (req,res)=>{
  const id = req.params.productId
  const itemsToUpdate = req.body 
  try{
    let product = await productsModel.findByIdAndUpdate(id, itemsToUpdate)
    res.status(200).render('index',{titulo:"Producto actualizado",products: product})
  }
  catch(error){
    console.log("Can't put products with Mongoose"+error)
  }
})


productsRouter.delete('/:productId', async (req,res)=>{
  const id = req.params.productId
  try{
    let product = await productsModel.findByIdAndDelete(id)
    res.status(200).render('index',{titulo:"Producto eliminado",products: product})
  }
  catch(error){
    console.log("Can't put products with Mongoose"+error)
  }
})

export default productsRouter