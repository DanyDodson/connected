import mongoose from 'mongoose'
import config from '../config'

let dbString = null
const env = config.app.env

if (env === 'development') dbString = config.mongo.development
if (env === 'test') dbString = config.mongo.testing
if (env === 'production') dbString = config.mongo.production

export default async () => {

  const connection = await mongoose.connect(
    dbString,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
    }
  )

  return connection.connection.dbString
}
