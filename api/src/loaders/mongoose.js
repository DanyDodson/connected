import mongoose from 'mongoose'
import config from '../config'

let db = null
if (process.env.NODE_ENV === 'development') db = config.mongo.development
if (process.env.NODE_ENV === 'test') db = config.mongo.testing
if (process.env.NODE_ENV === 'production') db = config.mongo.production

// mongoose.Promise = global.Promise

export default async () => {
  const connection = await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  return connection.connection.db
}
