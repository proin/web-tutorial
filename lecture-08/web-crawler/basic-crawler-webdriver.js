'use strict'

const webdriverio = require('webdriverio');
const cheerio = require('cheerio');
const options = {desiredCapabilities: {browserName: 'chrome'}};

let client = webdriverio.remote(options);

client = client.init();

let recursive = (query)=> new Promise((resolve)=> {
    client
        .url('http://www.naver.com')
        .setValue('#query', query)
        .pause(1500)
        .click('#search_btn')
        .getHTML('body')
        .then(function (html) {
            let $ = cheerio.load(html);

            let list = [];

            $('.blog.section ul li a.sh_blog_title').each(function () {
                let title = $(this).text().trim();
                let href = $(this).attr('href');
                list.push({title: title, href: href});
            });

            console.log(list);

            resolve();
        })
})

async function main() {
    let list = ['월평 맛집', '유성 맛집'];

    for(let i=0;i<list.length;i++)
        await recursive(list[i]);

    client.end();
}

main();
