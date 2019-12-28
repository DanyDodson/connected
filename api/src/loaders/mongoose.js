import mongoose from 'mongoose'
import config from '../config'

let db = null
const env = config.app.env

if (env === 'development') db = config.mongo.development
if (env === 'test') db = config.mongo.testing
if (env === 'production') db = config.mongo.production

export default async () => {

  // mongoose.Promise = global.Promise
  const connection = await mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )

  return connection.connection.db
}
