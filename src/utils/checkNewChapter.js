
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
    var chapterList = dom.window.document.getElementsByClassName("scroll-sm");
    console.log(`chapterList: ${chapterList}`);
    console.log(`chapterList[0] :${chapterList[0]}`);
    var firstChild = chapterList[0].firstChild;
    var itemChapterList = chapterList[0].getElementsByClassName('item');
    console.log(`itemChapterList.length: ${itemChapterList.length}`);
    // console.log(`liChapterList.length: ${liChapterList}`);
    var dataNumbers = dom.window.document.querySelector('[data-number]');
    console.log(`dataNumbers: ${dataNumbers}`)
    console.log(`dataNumbers.value: ${dataNumbers.value}`)
    console.log(`dataNumbers.nodeValue: ${dataNumbers.nodeValue}`)
    console.log(`dataNumbers.nodeName: ${dataNumbers.nodeName}`)
    console.log(`dataNumbers.nodeType: ${dataNumbers.nodeType}`)
    console.log(`dataNumbers.getAttributeNames(): ${dataNumbers.getAttributeNames()}`)

    // ROZWIĄZANIE!!!!!!!!! JEST TUUUUUTAAAAAAAAAJ::::::
    console.log(`dataNumbers.getAttribute('data-number'): ${dataNumbers.getAttribute('data-number')}`)

    console.log(`dataNumbers.tagName: ${dataNumbers.tagName}`)
    console.log(`dataNumbers.outerHTML: ${dataNumbers.outerHTML}`)
    console.log(`dataNumbers: ${dataNumbers}`)


    for (let chapter in dataNumbers) {
        console.log(`chapter: ${chapter}`);
    }

    // console.log(`chapterList[0].outerHTML :${chapterList[0].outerHTML}`);
    console.log(`chapterList[0].hasChildNodes(): ${chapterList[0].hasChildNodes()}`);    
    console.log(`dataNumbers.outerHTML: ${dataNumbers.outerHTML}`)

    console.log(`chapterList[0].firstChild: ${chapterList[0].firstChild}`);
    console.log(`chapterList[0].ELEMENT_NODE: ${chapterList[0].ELEMENT_NODE}`);
    console.log(`chapterList[0].ATTRIBUTE_NODE: ${chapterList[0].ATTRIBUTE_NODE}`);
    console.log(`chapterList[0].TEXT_NODE: ${chapterList[0].TEXT_NODE}`);
    console.log(`chapterList[0].CDATA_SECTION_NODE: ${chapterList[0].CDATA_SECTION_NODE}`);
    console.log(`chapterList[0].getElementsByTagName('li'): ${chapterList[0].getElementsByTagName('li')}`);


    console.log(`chapterList[0].firstChild: ${chapterList[0].firstChild}`);
    console.log(`chapterList[0].firstChild.data: ${chapterList[0].firstChild.data}`);
    console.log(`chapterList[0].firstChild.wholeText: ${chapterList[0].firstChild.wholeText}`);
    console.log(`chapterList[0].firstChild.length: ${chapterList[0].firstChild.length}`);
    console.log(`chapterList[0].firstChild.textContent: ${chapterList[0].firstChild.textContent}`);
    // console.log(`chapterList[0].firstChild.getAttribute('data-number'): ${chapterList[0].firstChild.getAttribute('data-number')}`);










    var lastChapter = chapterList[0]

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

