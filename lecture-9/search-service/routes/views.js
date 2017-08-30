'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res)=> {
    res.render('index', { title: 'Index', message: 'Hello, World!' })
})

// basic pug example
router.get('/pug', (req, res)=> {
    res.render('pug', { title: 'Pug!', message: 'Hello Pug!' })
})

// route example
router.get('/users', (req, res)=> {
    res.render('users')
})

router.get('/users/:userId', (req, res)=> {
    res.render('users-detail', { username: req.params.userId })
});

// middleware:: session
router.get('/middleware/session', (req, res)=> {
    res.render('middleware-session', { username: req.session.username })
});

router.get('/middleware/mysql', (req, res)=> {
    res.render('middleware-mysql')
});

router.get('/middleware/elastic', (req, res)=> {
    res.render('middleware-elastic')
});

module.exports = router
