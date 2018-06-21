var express = require('express')
var router = express.Router()
var passport = require('passport')
var mongoose = require('mongoose')
var User = require('./../models/Users')
var Q = require("q")

const create = async (req, res) => {

  var user = new User()
  user.name = req.body.name
  user.email = req.body.email
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

const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      res.status(404).json(err)
    }
login
    if (user) {
      var token = user.generateJwt()
      res.status(200).json({ "token" : token, user_id: user._id })
    } else {
      res.status(401).json(info)
    }
  })(req, res)
}

const update = async (req, res) => {
    res.send(await usersController.update(req.params.id, req.body))
}

const list = async (req, res) => {
    res.send(await usersController.list({ sort: { created_on: -1 }}))
}

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
router.post("/update/:id", update)
router.get("/list", list)
router.get(["/view/:id", "/:id", "/profile/:id"], details)

module.exports = router
