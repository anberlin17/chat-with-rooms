import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
  message: { type: String, required: true },
  username: { type: String, require: true },
  room: { type: String, require: true },
  date: { type: Date, default: Date.now }
})

export const MessageModel = model('Message', messageSchema, 'messages')
