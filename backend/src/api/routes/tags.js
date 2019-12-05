import {
  tags
} from '../../controllers/tag'

import {
  Router
} from 'express'

const route = Router()

export default route(app => {
  app.use('/tags', route)
  route.get('/', tags)
})
