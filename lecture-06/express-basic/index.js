'use strict'

const express = require('express')
let app = express()

// statics
app.use('/libs', express.static('bower_components'))

// middleware
let requestTime = (req, res, next)=> {
    req.TIME = new Date()
    next()
}

app.use(requestTime)

// GET Method
app.get('/', (req, res)=> {
    res.send('GET: ' + req.TIME)
});

// POST Method
app.post('/', (req, res)=> {
    res.send('POST: ' + req.TIME)
});

app.listen(3000, ()=> {
    console.log('server listening. http://localhost:3000')
    console.log('static ex. http://localhost:3000/libs/bootstrap/dist/js/bootstrap.js')
})
