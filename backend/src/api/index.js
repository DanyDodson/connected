import { Router } from 'express'
import auth from './routes/auth'
import users from './routes/users'
// import artists from './routes/artists'
// import posts from './routes/posts'
// import tags from './routes/tags'
// import mediums from './routes/mediums'
// import messages from './routes/messages'
import agendash from './routes/agendash'

// // guaranteed to get dependencies
export default () => {
  const app = Router()
  auth(app)
  users(app)
  //   artists(app)
  //   posts(app)
  //   tags(app)
  //   mediums(app)
  //   messages(app)
  agendash(app)

  return app
}
