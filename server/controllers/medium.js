const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.getMediums = async (req, res) => {
    try {
        const mediums = await Post.find().distinct('mediums')
        return res.status(200).json({ mediums: mediums })
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
}
