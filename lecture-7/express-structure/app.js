'use strict'

const TEST = 1

// import npms
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

// import customized middleware
const mysql = require('./middleware/mysql')
const elastic = require('./middleware/elastic')
const logger = require('./middleware/logger')

// import customized routes
const views = require('./routes/views')
const api = require('./routes/api')

// define app
const app = express()

// define settings
app.set('view engine', 'pug')

// define middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger({
    host: 'localhost:9200'
}))

app.use(mysql({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'samples'
}))

app.use(elastic({
    host: 'localhost:9200'
}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// define routes
app.use('/libs', express.static('bower_components'))
app.use('/static', express.static('static'))
app.use('/', views)
app.use('/api', api)

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
