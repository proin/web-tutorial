'use strict'

module.exports = (config)=> (req, res, next)=> {
    const elastic = require('elasticsearch')
    
    config = ()=> config
    req.elastic = new elastic.Client(config());

    next();
};
