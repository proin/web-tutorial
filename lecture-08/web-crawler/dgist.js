'use strict'

const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv')

// http connection
let con = (page, encoding)=> new Promise((resolve)=> {
    if(!encoding) encoding = 'utf-8'
    request.post({
        url: `http://curation.dgist.ac.kr/web/public/front/board_list.json`,
        data: {
            pageIndex: page,
            recordCountPerPage:10,
            searchType: 'Title',
            searchKeyword: null,
            category: null,
            orderType: 2
        },
        encoding: 'binary'
    }, (err, res, body)=> {
        if(err) return resolve({ err: err })
        try {
            let charSet = encoding;
            body = new Buffer(body, 'binary');
            let Iconv = iconv.Iconv;
            let ic = new Iconv(charSet, 'utf-8');
            body = ic.convert(body).toString();

            resolve({ html: body })
        } catch (e) {
            resolve({ err: e })
        }
    })
})

async function main() {
    // request url
    let result = []
    for(let i = 0 ; i < 10 ; i++) {
        let { err, html } = await con( i + 1, 'utf-8')
        let data = JSON.parse(html).rows
        result = result.concat(data)
    }

    console.log(result)
}

main();
