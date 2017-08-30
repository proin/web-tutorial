'use strict'

module.exports = (client)=> (req, res, next)=> {
    req.elastic = client 
    next();
};
