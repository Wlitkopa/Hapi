
const { Client, IntentsBitField, InteractionResponse, EmbedBuilder, ActivityType } = require("discord.js");
require('dotenv').config();
const checkAllNewChapters = require("../../utils/checkAllNewChapters.js");
const displayComic = require('../../utils/displayComic.js');
const Comic = require('../../models/Comic.js');



const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})
module.exports = async (client) => {

    const channel = await client.channels.cache.get(process.env.HAPI_CHANNEL_ID);
    const query = { monitored: 1 };
    const intervalTime = 28800000; // 8*60*60*1000

    try {

        setInterval(async () => {

            const date = new Date();
            let day = date.getDay();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes;
            };
            if (hours < 10) {
                hours = '0' + hours;
            };

            const comics = await Comic.find(query);
            let replyContent = await checkAllNewChapters(comics);
        

            // If there is any new chapter
            if (replyContent != ``) {
                // console.log(`State of chapters for: **${hours}:${minutes}, ${day}.${month}.${year}**`);

                replyContent = `*State of chapters for:  ${hours}:${minutes}, ${day}.${month}.${year}*\n\n` + replyContent;
                console.log(`replyContent: ${replyContent}`);
                await channel.send({
                    content: replyContent,
                });
            } else {
                replyContent = `*State of chapters for: ${hours}:${minutes}, ${day}.${month}.${year}*\n\n` + replyContent;

                await channel.send({
                    content: 'There aren\'t any new chapters for monitored comics.',
                });
            }

            // let message = "Nums: ";
            // nums.forEach((num) => {message += `${num} `});
            // await channel.send({
            //     content: message,
            // });


        }, intervalTime);
    } catch (error) {
        console.log(error)
    }

}

