import mongoose from 'mongoose'
import config from '../config'

export default async () => {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  return connection.connection.db
}
