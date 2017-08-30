'use strict'

const TEST = 1

// import npms
const elasticsearch = require('elasticsearch')
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

// use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// create elastic client
const elasticURL = 'localhost:9200'
let elasticclient = new elasticsearch.Client({ host: elasticURL });

// use logger with elastic
app.use(logger(elasticclient))

// use elastic middleware
app.use(elastic(elasticclient))

// use mysql middleware
app.use(mysql({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'samples'
}))

// use session middleware
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

// app start
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
