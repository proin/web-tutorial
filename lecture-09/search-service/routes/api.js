'use strict'

const express = require('express')
const router = express.Router()
const mecab = require('mecab-ffi')

router.get('/search', (req, res)=> {
    let { q, multi_match } = req.query;

    if(!q) 
        return res.send({ code: 404})

    let result = mecab.parseSync(q);

    // use bool
    let refine = [];
    for(let i = 0 ; i < result.length ; i++) {
        if(result[i][1].indexOf('N') === -1)
            continue;

        if(result[i][result[i].length-1] !== '*') {
            let d = result[i][result[i].length-1].split('+');
            for(let j = 0 ; j < d.length ; j++) {
                refine.push({ type: 'must', val: d[j].split('/')[0] });
            }
        } 
        
        refine.push({ type: 'should', val: result[i][0] })
    }

    let should = [];
    for(let i = 0 ; i < refine.length ; i++) {
        should.push({ term: { content: refine[i].val }});
        should.push({ term: { title: refine[i].val }});
    }

    if(!multi_match) {
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
            res.jsonp(resp);
        })
        return;
    }

    // use multi match
    refine = '';
    for(let i = 0 ; i < result.length ; i++) {
        if(result[i][1].indexOf('N') === -1)
            continue;
        refine = result[i][0] + ' ';
    }

    refine = refine.trim();

    req.elastic.search({
        index: 'dataset',
        body: {
            size: 15,
            query: {
                multi_match: {
                    query: refine,
                    fields: [ 'title', 'content' ]
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

router.post('/search', (req, res)=> {
    let { q, multi_match } = req.body;

    if(!q) 
        return res.send({ code: 404})

    let result = mecab.parseSync(q);

    // use bool
    let refine = [];
    for(let i = 0 ; i < result.length ; i++) {
        if(result[i][1].indexOf('N') === -1)
            continue;

        if(result[i][result[i].length-1] !== '*') {
            let d = result[i][result[i].length-1].split('+');
            for(let j = 0 ; j < d.length ; j++) {
                refine.push({ type: 'must', val: d[j].split('/')[0] });
            }
        } 
        
        refine.push({ type: 'should', val: result[i][0] })
    }

    let should = [];
    for(let i = 0 ; i < refine.length ; i++) {
        should.push({ term: { content: refine[i].val }});
        should.push({ term: { title: refine[i].val }});
    }

    if(!multi_match) {
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
        return;
    }

    // use multi match
    refine = '';
    for(let i = 0 ; i < result.length ; i++) {
        if(result[i][1].indexOf('N') === -1)
            continue;
        refine = result[i][0] + ' ';
    }

    refine = refine.trim();

    req.elastic.search({
        index: 'dataset',
        body: {
            size: 15,
            query: {
                multi_match: {
                    query: refine,
                    fields: [ 'title', 'content' ]
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
