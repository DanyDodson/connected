import { Container } from 'typedi'
import AuthService from '../services/auth'

export default {
  user: async (payload) => {
    const authServiceInstance = await Container.get(AuthService)
    const { role } = await authServiceInstance.userRolesService(req.payload)
    next()
  },
  admin: async (payload) => {
    const authServiceInstance = await Container.get(AuthService)
    const { role } = await authServiceInstance.userRolesService(req.payload)
    next()
  }
}