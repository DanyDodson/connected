const mongoose = require('mongoose');
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    message: { type: String, required: true },
    message_sent: { type: Boolean, default: null },
    message_recieved: { type: Boolean, default: null },
    to_ids: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    from_ids: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
})

mongoose.model('Message', MessageSchema)