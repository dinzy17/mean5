var mongoose = require( 'mongoose' )
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var constants = require("./../config/constants")

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
})

userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
  return { salt: this.salt, hash: this.hash}
}

userSchema.methods.validPassword = (password, user) => {
  var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex')
  return user.hash === hash
}

userSchema.methods.generateJwt = () => {
  var expiry = new Date()
  expiry.setDate(expiry.getDate() + 7)

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, constants.secret)
}

module.exports = mongoose.model('User', userSchema)
