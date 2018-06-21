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
    User.find({},{ email: 1, name: 1}, (err, userList) => {
      if (err) {
        res.status(401).send(err)
      } else {
        res.send(userList)
      }
    })
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
router.get(["/view/:id", "/:id", "/profile/:id"], auth, details)

module.exports = router
