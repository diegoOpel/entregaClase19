import express from 'express'

const chatRouter = express.Router()

chatRouter.get('/', (req,res)=>{
  res.status(200).render("chat");
})

export default chatRouter