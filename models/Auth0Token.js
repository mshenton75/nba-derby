const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const _ = require('lodash')

// TODO: encrypt token
const Auth0Token = new mongoose.Schema({
  access_token: { type: String, required: true }
})

Auth0Token.statics.lastToken = async function () {
  const tokenObject = await this.findOne().sort({ created_at: -1 }).exec()
  return _.get(tokenObject, 'access_token')
}

Auth0Token.plugin(encrypt, {
  encryptionKey: process.env.ENCRYPTION_KEY,
  signingKey: process.env.SIGNING_KEY,
  requireAuthenticationCode: false
})

mongoose.model('Auth0Token', Auth0Token)
