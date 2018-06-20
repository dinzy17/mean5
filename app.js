var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cors = require('cors')
var routesApi = require('./api/routes/index')

var passport = require('passport')
const mongooseConnect = require('./api/models/db');
require('./api/config/passport');

mongooseConnect.dbConnect()

var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use(passport.initialize())
app.use('/api', routesApi)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handlers
// development error handler
if (app.get('env') !== 'development') {
    app.use(function(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
          res.status(401)
          res.json({"message" : err.name + ": " + err.message})
        } else {
          res.status(err.status || 500)
          res.render('error', {
              message: err.message,
              error: err
          })
        }
    })
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

module.exports = app
