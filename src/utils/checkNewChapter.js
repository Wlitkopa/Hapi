
const Comic = require('../models/Comic.js');
const displayComic = require('./displayComic.js');
const axios = require('axios').default;

module.exports = async (dbComic) => {

    var newChapter = null;
    var comicWebPage;
    const chaptersReg = /<li class="item" data-number=\d+*>/g
    
    console.log(displayComic(dbComic));

    await axios.get(dbComic.comicUrl, {
        responseType: 'document'
    })
    .then(function (response) {
        console.log('Success with extracting data');
        comicWebPage = response.data;
      })
    .catch(function (error) {
        console.log(`There was an error using axios: ${error}`);
    });

    console.log(`AXIOS:\n${comicWebPage}`);
    var chapters = comicWebPage.match(chaptersReg) || 0;

    if (chapters) {
        console.log(`chapters: ${chapters}`);
        for (let chapter of chapters) {

            console.log(chapter + '\n');
        }
    } else {
        console.log('Regex did not work');
    }


    return 1;
}

