const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const MessageSchema = new mongoose.Schema({
  details: {
    message: { type: String, index: 1 },
    message_sent: Boolean,
    message_recieved: Boolean,
    to: [{ type: ObjectId, ref: 'User' }],
    from: [{ type: ObjectId, ref: 'User' }],
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

// MessageSchema.index({ 'details.message': 1, })

mongoose.model('Message', MessageSchema)
