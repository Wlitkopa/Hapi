
const Comic = require('../models/Comic.js');
const displayComic = require('./displayComic.js');
const axios = require('axios').default;
const jsdom = require("jsdom");

module.exports = async (dbComic) => {

    var comicWebHtml;
    
    // console.log(displayComic(dbComic));

    // // with encoding, fixed User-Agent and proxy
    // const config = {
    //     headers: {
    //       'Accept-Encoding': 'gzip, deflate, br',
    //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    //     },
    //     responseType: 'document',
    //     proxy: {
    //         protocol: 'http',
    //         host: '185.32.6.131',
    //         port: 8070
    //     },
    //   };
    
    // await axios.get(dbComic.comicUrl, config).then((response) => {
    //     console.log('Accept-Encoding status:', response.status);
    //     console.log('Success with extracting data using encoding');
    //     comicWebHtml = response.data;
    //     // console.log(`response.data: ${response.data}`)
    //   })
    //   .catch((error) => {
    //     console.error(`There was an error using axios: ${error}`);
    //   });


    // without encoding, fixed User-Agent and proxy
    console.log(`dbComic.comicUrl: ${dbComic.comicUrl}`)
    await axios.get(dbComic.comicUrl, {
        responseType: 'document'
    })
    .then(function (response) {
        console.log('Success with extracting data without encoding');
        comicWebHtml = response.data;
        // console.log(`response: ${response}`);
      })
    .catch(function (error) {
        console.log(`error.response.data: ${error.response.data}\n\nerror.response.headers: ${error.response.headers}\n\n`);
        console.log(`There was an error using axios: ${error}`);
        return null;
    });


    // console.log(`AXIOS:\n${comicWebHtml}`);
    try {
        const dom = new jsdom.JSDOM(comicWebHtml);
        var lastChapter = dom.window.document.querySelector('[data-number]');
        var lastChapterNum = parseFloat(lastChapter.getAttribute('data-number'));
        // console.log(`lastChapterNum: ${lastChapterNum}`);
    }
    catch (error) {
        console.log(`error: ${error}`);
        console.log(`Comic ${dbComic.comicName} has invalid dom structure.`);
        return 0;
    }


    if (lastChapterNum > dbComic.previousChapter) {
        console.log(`End of checkNewChapters function.\nPreviousChapter: ${dbComic.previousChapter}\nNew chapter: ${lastChapterNum}`);
        return lastChapterNum;
    } else {
        console.log("End of checkNewChapters function. There is not any new chapter");
        return null;
    }

}

