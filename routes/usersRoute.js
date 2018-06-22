var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('./../models/Users')
var constants = require('./../config/constants')
var jwt = require('express-jwt')
var auth = jwt({
  secret: constants.secret,
  userProperty: 'payload'
})

//function to create/register new user
const create = async (req, res) => {

  var user = new User()
  user.name = req.body.name
  user.email_id = req.body.email_id
  let userSecurityDetails = user.setPassword(req.body.password)
  user.salt = userSecurityDetails.salt
  user.hash = userSecurityDetails.hash

  user.save((err, newUser) => {
    if (err) {
      res.status(500).send(err)
    }
    var token = user.generateJwt()
    res.send({ "token" : token, user_id: newUser._id })
  })
}

//function to check login of user
const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      res.status(404).json(err)
    }

    if (user) {
      var token = user.generateJwt()
      res.status(200).json({ "token" : token, user_id: user._id })
    } else {
      res.status(401).json(info)
    }
  })(req, res)
}

//function to update user
const update = async (req, res) => {

  User.update({ _id: req.body._id},{ $set: req.body} ,(err, updatedUser)=>{
    if (err) {
      res.status(401).send(err)
    } else {
      res.send(updatedUser)
    }
  })
}

//function to get user list
const list = async (req, res) => {
  const { fields, offset, query, order } = req.body
  User.find({}, fields, (err, userList) => {
    if (err) {
      res.status(401).send(err)
    } else {
      res.send(userList)
    }
  }).sort(order).skip(offset)
}

// function to get details of user
const view = (req, res) => {
  const { query, fields } = req.body
  User.findOne(query, fields ,(err, user) => {
    if (err) {
      res.status(401).send(err)
    } else {
      res.send(user)
    }
  })
}

// function to get details of current user
const details = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(401).send(err)
    } else {
      res.send(user)
    }
  })
}

router.post("/register", create)
router.post("/login", login)
router.post("/update", update)
router.post("/list", list)
router.post("/view", view)
router.get(["/view/:id", "/:id", "/profile/:id"], auth, details)

module.exports = router
