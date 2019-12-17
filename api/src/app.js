const expressApp = require('./loaders')
const express = require('express')
const app = express()

const startServer = async () => {
  await expressApp()
}

startServer()