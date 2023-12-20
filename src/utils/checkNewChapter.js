
const Comic = require('../models/Comic.js');
const displayComic = require('./displayComic.js');
const axios = require('axios').default;
const jsdom = require("jsdom");

module.exports = async (dbComic) => {

    var comicWebHtml;
    
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
        return null;
    });

    

    // console.log(`AXIOS:\n${comicWebHtml}`);
    try {
        const dom = new jsdom.JSDOM(comicWebHtml);
        var lastChapter = dom.window.document.querySelector('[data-number]');
        var lastChapterNum = parseFloat(lastChapter.getAttribute('data-number'));
        console.log(`lastChapterNum: ${lastChapterNum}`);
    }
    catch (error) {
        console.log(`Comic ${dbComic.comicName} has invalid url:\n${dbComic.comicUrl}`);
        return null;
    }


    if (lastChapterNum > dbComic.previousChapter) {
        console.log(`End of checkNewChapters function.\nPreviousChapter: ${dbComic.previousChapter}\nNew chapter: ${lastChapterNum}`);
        return lastChapterNum;
    } else {
        console.log("End of checkNewChapters function. There is not any new chapter");
        return null;
    }

}

