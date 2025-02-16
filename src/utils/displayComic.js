
module.exports = (comic) => {

    let message = `**Name:** ${comic.comicName}
    url: <${comic.comicUrl}>
    lastRead: ${comic.lastRead}
    previousChapter: ${comic.previousChapter}
    monitored: ${comic.monitored}\n\n`;
    
    return message;

};