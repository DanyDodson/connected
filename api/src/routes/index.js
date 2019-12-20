import { Router } from 'express'
import auth from './auth'
import profiles from './profiles'
import posts from './posts'
import mediums from './mediums'
import tags from './tags'

export default () => {
  const app = Router()
  auth(app)
  profiles(app)
  posts(app)
  mediums(app)
  tags(app)
  return app
}