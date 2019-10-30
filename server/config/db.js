const mongoose = require('mongoose')
const config = require('config')
const db = 'mongodb+srv://danydodson:78x2pKfMPThXDKW7!@seesee-hz6ei.mongodb.net/connected?retryWrites=true&w=majority'
// const db = config.get('mongoURI')

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })

    console.log('[mongodb] connected to db ✔️')
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
