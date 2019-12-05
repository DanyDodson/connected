import {
  mediums
} from '../../controllers/mediums'

import {
  Router
} from 'express'

const route = Router()

export default route(app => {
  app.use('/mediums', route)
  route.get('/', mediums)
})
