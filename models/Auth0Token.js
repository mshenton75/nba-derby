const mongoose = require('mongoose')

const Auth0Token = new mongoose.Schema({
  access_token: { type: String, required: true }
})

Auth0Token.statics.lastToken = async function () {
  const tokenObject = await this.findOne().sort({ created_at: -1 }).exec()
  return tokenObject.access_token
}

mongoose.model('Auth0Token', Auth0Token)
