
module.exports = (comic) => {

    let message = `name: ${comic.comicName}
    url: <${comic.comicUrl}>
    lastRead: ${comic.lastRead}
    previousChapter: ${comic.previousChapter}
    monitored: ${comic.monitored}\n`;
    
    return message;

};