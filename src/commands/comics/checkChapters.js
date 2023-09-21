
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const checkNewChapter = require("../../utils/checkNewChapter.js");
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

            console.log(`dbComic.comicName: ${comics[0].comicName}`);

            // Comic exists in database
            if (comics) {
                // console.log("From checkChapters:\n" + displayComic(dbComic));

                let newChapter = checkNewChapter(comics[0]);

                // If new chapter exists
                if (newChapter) {

                    await interaction.editReply({
                        content: `There is new chapter for ${name}: ${newChapter}!`,
                    });
                    return;

                // If new chapter doesn't exist
                } else {

                    await interaction.editReply({
                        content: `There is no new chapter for comic "${name}"`
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


        };

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
