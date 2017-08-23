'use strict'

module.exports = (config)=> (req, res, next)=> {
    // create log
    let log = req.headers;
    log.time = new Date();
    log.path = req.path;
    log.remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    config = ()=> config

    // save to elastic
    const elastic = require('elasticsearch')
    let client = new elastic.Client(config());

    client.index({
        index: 'express',
        type: 'log',
        body: log
    }, (err, resp)=> {
        next();
    })
};

