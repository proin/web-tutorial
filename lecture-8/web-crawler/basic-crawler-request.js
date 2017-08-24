'use strict'

const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv')

// http connection
let con = (url, encoding)=> new Promise((resolve)=> {
    if(!encoding) encoding = 'utf-8'
    request.get({
        url: url,
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
    let { err, html } = await con('http://news.naver.com/main/main.nhn?mode=LSD&mid=shm&sid1=105', 'euc-kr')

    // create jQuery Object
    let $ = cheerio.load(html);

    // parse information
    // for analyze, use chrome dev tool
    let data = []
    $('.section_body li a').each(function() {
        let row = {} 
        row.title = $(this).text()
        row.href = $(this).attr('href')
        data.push(row)
    })

    console.log(data)
}

main();
