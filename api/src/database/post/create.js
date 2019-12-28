import { PostModel } from '../schema'

async function createPost ({
  username,
}) {
  return await PostModel.create({
    username,
  })
}

export { createPost }
