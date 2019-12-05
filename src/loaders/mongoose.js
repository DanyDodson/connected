const mongoose = require('mongoose')
const logs = require('../logs/log')
const config = require('config')
const db = config.get('db.atlas')

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    logs.data('[mongodb] connected to db ✔️')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB

import mongoose from 'mongoose'
import { Db } from 'mongodb'
import config from '../config'

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  return connection.connection.db
}
