import mongoose from 'mongoose'
import config from '../config'

let db = null
if (config.env === 'development') db = config.mongo.development
if (config.env === 'test') db = config.mongo.testing
if (config.env === 'production') db = config.mongo.production

export default async () => {
  const connection = await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  return connection.connection.db
}
