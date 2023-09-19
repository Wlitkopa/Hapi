
module.exports = (message) => {

    try {
        let msgXp = 0;
        let linksNumber = 0;
        const linksReg = /(http|https):\/\/[^\s]*\.[^\s]+/g;
        var links = message.content.match(linksReg) || 0;

        if (links != 0) {
            links += '';
            linksNumber = links.split(',').length || 0;
        } else {
            linksNumber = 0;
        }

        let attachmentNumber = message.attachments.size;
        msgXp += 3 * linksNumber; // Adds +3 exp points for each link
        msgXp += 2 * attachmentNumber; // Adds +2 exp points for each attachment
        msgXp += 5; // Adds +5 exp points for rach message

    return msgXp;

} catch (error) {
        console.log(`The was an error in getMessageXpPoints: ${error}`);
    }
};
