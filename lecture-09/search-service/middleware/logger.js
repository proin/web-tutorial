'use strict'

module.exports = (client)=> (req, res, next)=> {
    // create log
    let log = req.headers;
    log.time = new Date();
    log.path = req.path;
    log.remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // save to elastic
    client.index({
        index: 'express',
        type: 'log',
        body: log
    }, (err, resp)=> {
        next();
    })
};

