import config from '../config'
import basicAuth from 'express-basic-auth'
import agendash from 'agendash'
import { Container } from 'typedi'
import { Router } from 'express'

export default (app, route = Router()) => {

  app.use('/auth', route)

  const agendaInstance = Container.get('agendaInstance')

  route.use('/dash',
    basicAuth({ users: { [config.agendash.user]: config.agendash.password, }, challenge: true, }),
    agendash(agendaInstance)
  )
}



