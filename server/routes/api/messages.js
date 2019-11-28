const {
    messages
} = require('../../controllers/message')

const router = require('express').Router()

router.get('/test', messages)

module.exports = router


// router.get('/', auth, async (req, res) => {

//   const to = await req.body.to
//   const from = await User.findById(req.user.id)
//   Chat.find({ $or: [{ 'to': to }, { 'from': from }] }, (err, messages) => {
//     if (err)
//       res.send(err)
//     res.json(messages)
//   })
// })

// router.post('/', auth, (req, res) => {
//   const chat = new Chat()
//   chat.from = req.user._id
//   chat.to = req.body.to
//   chat.message = req.body.message
//   chat.save(err => {
//     if (err)
//       res.send(err)
//     res.json({ message: 'message sent' })
//   })
// })

// router.put('/:message_id', auth, async (req, res) => {
//   const message = await req.params.message_id
//   const from = await User.findById(req.user.id)
//   Chat.findOne({ $and: [{ '_id': message }, { 'from': from }] }, (err, message) => {
//     if (err)
//       res.send(err)
//     message.content = req.body.content
//     message.save(function (err) {
//       if (err)
//         res.send(err);
//       res.json({ message: 'message edited' })
//     })
//   })
// })

// router.delete('/chat/:message_id', auth, (req, res) => {
//   const message = await req.params.message_id
//   const from = await User.findById(req.user.id)
//   Chat.findOneAndRemove({ $and: [{ '_id': message }, { 'from': from }] }, err => {
//     if (err)
//       res.send(err)
//     res.json({ message: 'message removed' })
//   })
// })