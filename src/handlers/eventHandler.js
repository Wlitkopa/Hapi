
const path = require('path');
const getAllFiles = require("../utils/getAllFiles");


module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b);

        client.on(eventName, async (arg) => {
            for (const eventFile of eventFiles) {
                const eventFunction = require(eventFile);
                await eventFunction(client, arg);
            }

        })

    }

};
