var express = require('express')
var router = express.Router()
var jwt = require('express-jwt')
var constants = require('./config/constants')
var auth = jwt({
  secret: constants.secret,
  userProperty: 'payload'
})

router.use("/users", require("./routes/usersRoute"))

module.exports = router
