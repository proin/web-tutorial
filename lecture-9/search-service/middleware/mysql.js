'use strict'

module.exports = (config)=> (req, res, next)=> {
    const mysql = require('mysql');
    let con = mysql.createConnection(config);

    res.on('finish', ()=> {
        con.end(()=> {
        });
    })

    req.mysql = con;

    next();
};
