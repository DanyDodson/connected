const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.getTags = async (req, res) => {
    try {
        const tags = await Post.find().distinct('tags')
        return res.status(200).json({ tags: tags })
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
}
