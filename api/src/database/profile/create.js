import { ProfileModel } from '../schema'

async function createProfile ({
  username,
}) {
  return await ProfileModel.create({
    username,
  })
}

export { createProfile }
