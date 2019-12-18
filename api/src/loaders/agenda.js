import agenda from 'agenda'
import config from '../config'

export default (mongoConnection) => {

  return new agenda({
    mongo: mongoConnection,
    db: { collection: config.agenda.collection },
    name: config.agenda.name,
    // processEvery: config.agenda.pooltime,
    maxConcurrency: config.agenda.concurrency,
  })
}
