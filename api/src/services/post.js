export default class PostService {

  constructor (container) {
    this.logger = container.get('logger')
    this.PostModel = container.get('PostModel')
    this.CommentModel = container.get('CommentModel')
    this.UserModel = container.get('UserModel')
    this.ProfileModel = container.get('ProfileModel')
    this.agendaJob = container.get('agendaInstance')
  }

  async testingService () {
    this.logger.debug('0️⃣  calling posts test endpoint')
    return { msg: 'posts test route working' }
  }

  async loadPostSlugCtrl (post_slug) {
    this.logger.debug('0️⃣  calling preload post by slug endpoint')
    const post = await this.PostModel.findOne({ 'links.slug': post_slug })
    if (!post) throw new Error('post with that slug not found')
    return { post }
  }

  async getAllPostsService () {
    this.logger.debug('0️⃣  calling get all posts endpoint')
    const posts = await this.PostModel.find().sort({ date: -1 })
    return { posts }
  }

  async newPostService (user_id, userInput) {
    this.logger.debug('0️⃣  calling new post endpoint')
    const user = await this.UserModel.findOne({ _id: user_id })
    const profile = await this.ProfileModel.findOne({ user: user_id })
    const post = await new this.PostModel(userInput)
    post.user = user
    post.profile = profile
    post.details.author = profile.details.username
    await post.save()
    await this.ProfileModel.updateOne({ user: user_id }, { $push: { posts: post._id } })
    this.logger.debug('✔️  new post created and pushed to profile')
    return { post }
  }

  async getPostService (post) {
    this.logger.debug('0️⃣  calling get post endpoint')
    if (post === null) return res.status(404).json({ msg: 'post not found' })
    this.logger.debug('✔️  post found and loaded')
    return { post }
  }

  async updatePostService () {
    this.logger.debug('0️⃣  calling update post endpoint')
    let post = req.post
    const {
      mediums,
      title,
      description,
      tags,
      price,
      critique,
      shareable,
      purchasable,
    } = req.body
    if (mediums) post.details.mediums = mediums.split(', ').map(medium => medium.trim()) || post.details.mediums
    if (title) post.details.title = title || post.details.title
    if (description) post.details.description = description || post.details.description
    if (tags) post.details.tags = tags.split(', ').map(tag => tag.trim()) || post.details.tags
    if (price) post.details.price = price || post.details.price
    if (critique) post.options.critique = critique || post.options.critique
    if (shareable) post.options.shareable = shareable || post.options.shareable
    if (purchasable) post.options.purchasable = purchasable || post.options.purchasable
    // post.updated = Date.now()
    await Post.findOneAndUpdate({ 'links.slug': req.post.links.slug }, { $set: post }, { new: true, upsert: true })
    if (post.options.purchasable) { await artist.addListed(post._id) }
    if (!post.options.purchasable) { await artist.addPosted(post._id) }
    // await post.setslug()
    // await post.seturl()
    // await post.save()
    if (post.comments.commentCount > 0) {
      await Comment.updateMany({ post: { $in: [post._id] } }, { $set: { 'links.parent': post.links.slug } }, { upsert: true })
      let comments = await Comment.find({ post: { $in: [post._id] } })
      comments.forEach(comment => {
        comment.seturl()
        comment.save()
      })
    }
    this.logger.debug('✔️  post updated and returned')
    return { post }
  }

  // async likePostService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { post }
  // }

  // async unLikePostService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { post }
  // }

  // async favoritePostService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { post }
  // }

  // async unFavoritePostService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { post }
  // }

  // async delPostService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return
  // }

  async loadCommentSlugService (post_slug) {
    this.logger.debug('0️⃣  calling preload comment by slug endpoint')
    const comment = await this.CommentModel.findOne({ 'links.slug': comment_slug })
    if (!comment) throw new Error('comment with that slug not found')
    return { comment }
  }

  // async getAllCommentsService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comments }
  // }

  // async newCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comment }
  // }

  // async getCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comment }
  // }

  // async updateCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comment }
  // }

  // async likeCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comment }
  // }

  // async unlikeCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //   this.logger.debug('✔️  calling new post endpoint')
  //   return { comment }
  // }

  // async delCommentService () {
  //   this.logger.debug('0️⃣  calling new post endpoint')
  //    this.logger.debug('✔️  calling new post endpoint')
  //   const post = req.post
  //   await post.delComment(req.comment.id)
  //   await Comment.findOneAndRemove({ _id: req.comment.id })
  //   await post.updateCommentCount()
  //   return
  // }

}