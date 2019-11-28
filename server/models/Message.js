const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const MessageSchema = new mongoose.Schema({
    details: {
        message: { type: String, required: true },
        message_sent: { type: Boolean, default: null },
        message_recieved: { type: Boolean, default: null },
        to: [{ type: ObjectId, ref: 'User' }],
        from: [{ type: ObjectId, ref: 'User' }],
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

MessageSchema.index({ 'details.message': 1, })

mongoose.model('Message', MessageSchema)