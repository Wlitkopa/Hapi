
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const checkNewChapter = require("../../utils/checkNewChapter.js");
const checkAllNewChapters = require("../../utils/checkAllNewChapters.js");
const displayComic = require('../../utils/displayComic.js');
const Comic = require('../../models/Comic.js');
const logger = require('../../utils/logger.js');


module.exports = {

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {

        await interaction.deferReply();

        const name = interaction.options.get('comic-name')?.value || null;

        // console.log(`comic-name: ${name}`);

        const date = new Date();
        let day = date.getDate();
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
        if (day < 10) {
            day = '0' + day;
        };
        if (month < 10) {
            month = '0' + month;
        };
        var replyContent = `*State of chapters for:  ${hours}:${minutes},  ${day}.${month}.${year}*\n\n`;
        

        // Checking new chapter for specified comic
        if (name) {

            const query = { comicName: name, };
            const comics = await Comic.find(query);

            // Comic exists in database
            if (comics.length != 0) {
                // console.log(`dbComic.comicName: ${comics[0].comicName}`);
                // console.log("From checkChapters:\n" + comics);

                

                let newChapter = await checkNewChapter(comics[0]);

                // If new chapter exists
                if (newChapter) {
                    replyContent = replyContent + `There is new chapter for **${name}**:\n   Previous Chapter: ${comics[0].previousChapter}\n   New chapter: ${newChapter}!`;

                    await interaction.editReply({
                        content: replyContent,
                    });
                    comics[0].previousChapter = newChapter;
                    await comics[0].save().catch((error) => {
                        // console.log(`Error saving updated comic: ${error}`);
                        logger.error(`Error saving updated comic: ${error}`);
                    });
                    return;

                // If new chapter doesn't exist
                } else {
                    if (newChapter == 0) {
                        replyContent = replyContent + `There was an error :(`
                    } else {
                        replyContent = replyContent + `There is no new chapter for comic "${name}"`
                    }
                    await interaction.editReply({
                        content: replyContent,
                    });
                    return;
                }

            // Comic doesn't exist in database
            } else {

                await interaction.editReply({
                    content: 'There is no such comic with given name in database.',
                });
                return;

            }


        // Checking chapter for every comic in database
        } else {

            const query = { monitored: 1 };
            const comics = await Comic.find(query);

            let functionReply = await checkAllNewChapters(comics);

            // If there is any new chapter
            if (functionReply != ``) {
                // console.log(`functionReply: ${functionReply}`);
                replyContent = replyContent + functionReply;
                await interaction.editReply({
                    content: replyContent,
                });
            } else {
                // console.log(`replyContent: ${replyContent}`);
                replyContent = replyContent + `There aren\'t any new chapters for monitored comics.`;
                await interaction.editReply({
                    content: replyContent,
                });
            }
            
        }

    },

    name: "checkchapters",
    description: "checks whether there are any new chapters within monitored comics.",
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,
    options: [
        {
            name: 'comic-name',
            description: 'Specifies comic which chapters will be checked.',
            type: ApplicationCommandOptionType.String,
        }
    ]
}
