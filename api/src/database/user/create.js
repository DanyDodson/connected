import User from '../../models/User'

async function createUser ({
  email,
  username,
  password,
  password2,
}) {
  return await User.create({
    email,
    username,
    password,
    password2,
  })
}

export { createUser }
