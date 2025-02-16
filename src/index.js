
require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');
const eventHandler = require('./handlers/eventHandler');
const logger = require('./utils/logger');


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        // mongoose.set('strictQuery', false);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");
        logger.info("Connected to DB.");
        

        eventHandler(client);

        client.login(process.env.TOKEN);


    } catch (error) {
        console.log(`There was an error: ${error}`);
        logger.error(`There was an error: ${error}`);
    }
})();

