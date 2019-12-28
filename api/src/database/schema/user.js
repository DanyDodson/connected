import { model, Schema } from 'mongoose'

const UserSchema = new Schema({
  salt: String,
  hash: String,
  username: String,
  email: { type: String, unique: true, index: 1 },
  role: { type: String, default: 'basic', enum: ['basic', 'featured', 'admin'] },
  authToken: { data: String },
  resetToken: { type: String },
  verifyToken: { type: String },
  verified: { type: Boolean, default: false },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

const UserModel = model('User', UserSchema)

export { UserModel }
