import {
  PostModel,
} from '../schema'

async function getPostById (id) {
  return await PostModel.findById(id).exec()
}

async function getPostBySlug (slug) {
  return await PostModel.findOne({ slug }).exec()
}

export {
  getPostById,
  getPostBySlug,
}
