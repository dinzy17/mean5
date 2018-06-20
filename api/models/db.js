const mongoose = require("mongoose")
mongoose.set('debug', true)
var dbURI = 'mongodb://localhost/meanAuth';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    bufferMaxEntries: 0
  }

let services = {}
services.dbConnect = () => {
    const db = mongoose.connect(dbURI,options)

    mongoose.connection.on('error', function (err) {
        console.log(">>>argggggggggg"+ process.env.NODE_ENV)
       })

    mongoose.connection.on('disconnecting', function(){
        console.log('db: mongodb is disconnecting!!!')
    })

    mongoose.connection.on('disconnected', function(){
        console.log('db: mongodb is disconnected!!!')
    })

    mongoose.connection.on('reconnected', function(){
        console.log('db: mongodb is reconnected: ' + url)
    })

    mongoose.connection.on('timeout', function(e) {
        console.log("db: mongodb timeout "+e)
        // reconnect here
    })

    mongoose.connection.on('close', function(){
        console.log('db: mongodb connection closed')
    })
}

module.exports = services
