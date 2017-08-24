'use strict'

const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv')

// http connection
let con = (url, encoding)=> new Promise((resolve)=> {
    if(!encoding) encoding = 'utf-8'
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
    let { err, html } = await con('http://www.melon.com/chart/index.htm#params%5Bidx%5D=1', 'euc-kr')

    // create jQuery Object
    let $ = cheerio.load(html);
    
    let data = []

    $('.service_list_song.type02.d_song_list .wrap_song_info').each(function() {
        let row = {}
        
        row.song = $(this).find('> div.rank01').text().trim()
        row.singer = $(this).find('> div.rank02 span').text().trim()

        if(row.song) 
            data.push(row)
    })

    console.log(data.splice(0, 5))
}

main();
