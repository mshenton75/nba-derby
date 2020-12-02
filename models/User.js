const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// TODO: indexing doesn't seem to work
const User = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true, required: [true, 'required'], index: true },
  email: { type: String, lowercase: true, unique: true, required: [true, 'required'], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true }
})

User.plugin(uniqueValidator, { message: 'is already taken.' })

// TODO: this doesn't work
User.methods.fullName = function () {
  return `${this.first_name} ${this.last_name}`
}

mongoose.model('User', User)
