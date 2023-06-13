import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  userMail: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

export const messagesModel = mongoose.model(messagesCollection,messagesSchema);