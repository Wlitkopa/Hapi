
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const checkNewChapter = require("../../utils/checkNewChapter.js");
const checkAllNewChapters = require("../../utils/checkAllNewChapters.js");
const displayComic = require('../../utils/displayComic.js');
const Comic = require('../../models/Comic.js');


module.exports = {

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */

    callback: async (client, interaction) => {

        await interaction.deferReply();

        const name = interaction.options.get('comic-name')?.value || null;

        console.log(`comic-name: ${name}`);
        

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

                    await interaction.editReply({
                        content: `There is new chapter for ${name}:\n   Previous Chapter: ${comics[0].previousChapter}\n   New chapter: ${newChapter}!`,
                    });
                    comics[0].previousChapter = newChapter;
                    await comics[0].save().catch((error) => {
                        console.log(`Error saving updated comic: ${error}`);
                    });
                    return;

                // If new chapter doesn't exist
                } else {
                    
                    await interaction.editReply({
                        content: `There is no new chapter for comic "${name}"`,
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
            let changes = 0;
            const query = { monitored: 1 };
            const comics = await Comic.find(query);


            let replyContent = await checkAllNewChapters(comics);

            // If there is any new chapter
            if (replyContent != ``) {
                console.log(`replyContent: ${replyContent}`);
                await interaction.editReply({
                    content: replyContent,
                });
            } else {
                await interaction.editReply({
                    content: 'There aren\'t any new chapters for monitored comics.',
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
