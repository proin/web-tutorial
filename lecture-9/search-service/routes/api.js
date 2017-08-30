'use strict'

const express = require('express')
const router = express.Router()
const mecab = require('mecab-ffi')

router.post('/search', (req, res)=> {
    let { q } = req.body;

    let result = mecab.parseSync(q);

    let should = [];
    for(let i = 0 ; i < result.length ; i++) {
        should.push({ term: { context: result[i][0] }});
        should.push({ term: { title: result[i][0] }});
    }

    req.elastic.search({
        index: 'dataset',
        body: {
            size: 15,
            query: {
                bool: {
                    should: should
                }
            },
            aggs: {
                byClass: {
                    terms: {
                        field: "class"
                    }
                }, byDate: {
                    date_histogram: {
                        field: "date",
                        interval: "month"
                    }
                }
            }
        }
    }, (err, resp)=> {
        for(let i = 0 ; i < resp.aggregations.byClass.buckets.length ; i++) {
            if(resp.aggregations.byClass.buckets[i].key == 'it') {  
                resp.aggregations.byClass.buckets.splice(i, 1);
                i--;
            }
        }
        res.send(resp);
    })
})

module.exports = router
