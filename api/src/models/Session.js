import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  jwt: { type: String },
  user_id: { type: String, unique: true },
})

// SessionSchema.methods.jwtForSession = function () {
//   const today = new Date()
//   const exp = new Date(today)
//   exp.setDate(today.getDate() + 1)
//   return jwt.sign({
//     iss: 'seesee',
//     iat: parseInt(iat.getTime() / 1000),
//     nbf: parseInt(iat.getTime() / 1000),
//     jti: this._id,
//     exp: parseInt(exp.getTime() / 1000),
//   }, config.jwtSecret)
// }

SessionSchema.methods.toSession = function() {
  return {
    _id: this._id,
    user_id: this.user_id,
    jwt: this.jwtForSession(),
  }
}

export default mongoose.model('Session', SessionSchema)
