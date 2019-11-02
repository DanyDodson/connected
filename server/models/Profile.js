const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new mongoose.Schema({
  bio: { type: String },
  // company: { type: String },
  website: { type: String },
  // location: { type: String },
  status: { type: String, },
  // skills: { type: [String], },
  // githubusername: { type: String },
  social: {
    youtube: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String }
  },
  education: [
    {
      school: { type: String, },
      degree: { type: String, },
      fieldofstudy: { type: String, },
      from: { type: Date, },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String }
    }
  ],
  // experience: [
  //   {
  //     title: { type: String, },
  //     company: { type: String, },
  //     location: { type: String },
  //     from: { type: Date, },
  //     to: { type: Date },
  //     current: { type: Boolean, default: false },
  //     description: { type: String }
  //   }
  // ],
  user: { type: Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true })

module.exports = Profile = mongoose.model('profile', ProfileSchema)
