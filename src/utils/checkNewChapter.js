
const Comic = require('../models/Comic.js');
const displayComic = require('./displayComic.js');
const axios = require('axios').default;
const jsdom = require("jsdom");

module.exports = async (dbComic) => {

    var newChapter = null;
    var comicWebHtml;
    const chaptersReg = /<li class="item" data-number=\d*>/g;
    
    console.log(displayComic(dbComic));

    await axios.get(dbComic.comicUrl, {
        responseType: 'document'
    })
    .then(function (response) {
        console.log('Success with extracting data');
        comicWebHtml = response.data;
        // console.log(`response: ${response}`);
      })
    .catch(function (error) {
        console.log(`There was an error using axios: ${error}`);
    });

    // TODO: DOBRAĆ SIĘ DO NUMERÓW ROZDZIAŁÓW
    // console.log(`AXIOS:\n${comicWebHtml}`);
    const dom = new jsdom.JSDOM(comicWebHtml);
    console.log(`dom: ${dom}`)
    console.log(`dom.window.document: ${dom.window.document}`);
    var chapterList = dom.window.document.querySelectorAll("h1");
    console.log(`${chapterList}`);

    for (let chapter in chapterList) {
        console.log(`chapter: ${chapter}`);
    }

    // Regex parser
    // var chapters = comicWebHtml.match(chaptersReg) || 0;

    // if (chapters) {
    //     console.log(`chapters: ${chapters}`);
    //     for (let chapter of chapters) {

    //         console.log(chapter + '\n');
    //     }
    // } else {
    //     console.log('Regex did not work');
    // }

    console.log("End of checkNewChapters function");


    return 1;
}

