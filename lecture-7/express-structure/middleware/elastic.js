'use strict'

module.exports = (config)=> (req, res, next)=> {
    const elastic = require('elasticsearch')
    
    let configFn = ()=> config
    req.elastic = new elastic.Client(configFn());

    next();
};
