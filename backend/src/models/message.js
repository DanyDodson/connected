import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  details: {
    message: { type: String, index: 1 },
    message_sent: Boolean,
    message_recieved: Boolean,
    to: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
    from: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

// MessageSchema.index({ 'details.message': 1, })

mongoose.model('Message', MessageSchema)
