'use strict'

const express = require('express')
const router = express.Router()

// middleware:: session
router.post('/middleware/session', (req, res)=> {
    req.session.username = req.body.username;
    res.send({ status: 200 })
})

router.delete('/middleware/session', (req, res)=> {
    req.session.destroy()
    res.send({ status: 200 })
})

// middleware:: mysql
router.get('/middleware/mysql', (req, res)=> {
    req.mysql.query(`SELECT * FROM iitp LIMIT 10`, (err, rows)=> {
        res.send(rows)
    })
})

router.get('/test', (req, res)=> {
    req.elastic.searchrr({
        q: 'pants'
    }).then(function (body) {
        var hits = body.hits.hits;
        console.log(hits)
        res.send(hits)
    }, function (error) {
        console.trace(error.message);
    });
})

// middleware:: elastic
router.get('/middleware/elastic', (req, res)=> {
    req.elastic.search({
        index: 'express',
        body: {
            size: 0,
            aggs: {
                path: { 
                    terms: {
                        field: "path"
                    } 
                }
            } 
        }
    }, (err, resp)=> {
        res.send(resp.aggregations.path.buckets);
    })
})

module.exports = router
