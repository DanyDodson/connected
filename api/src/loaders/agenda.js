import Agenda from 'agenda'
import config from '../config'

export default ({ mongoConnection }) => {
  return new Agenda({
    mongo: mongoConnection,
    db: { collection: config.agenda.collection },
    name: config.agenda.name,
    maxConcurrency: config.agenda.concurrency,
  })
}
