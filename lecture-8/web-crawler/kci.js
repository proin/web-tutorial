'use strict'

const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv')

// http connection
let con = (url)=> new Promise((resolve)=> {
    request.get({
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36'
        },
        encoding: 'utf-8'
    }, (err, res, body)=> {
        if(err) return resolve({ err: err })
        resolve({ html: body })
    })
})

async function main() {
    // request url
    let { err, html } = await con('http://www.kci.go.kr/kciportal/oai/request?verb=ListRecords&set=ARTI&resumptionToken=1900-01-01:9999-12-31:101:8121')
    // create jQuery Object
    let $ = cheerio.load(html);
    $('record > metadata > *').each(function() {
        let row = {}

        $(this).find('> *').each(function() {
            let tag = $(this).prop('tagName')
            let value = $(this).text()

            if(typeof(row[tag]) == 'string') {
                row[tag] = [ row[tag] ]
                row[tag].push(value)
            } else {
                row[tag] = value
            }
        })

        console.log(row)
    })
}

main();
