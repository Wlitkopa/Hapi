const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Comic = require('../../models/Comic.js');
const displayComic = require('../../utils/displayComic.js')
const logger = require('../../utils/logger.js');


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {

        const name = interaction.options.get('name')?.value || null;
        const monitored = interaction.options.get('not-monitored')?.value || null;
        await interaction.deferReply();

        if (name === null && monitored === null) {
            await interaction.editReply({
                content: `Specify comic/comics to be deleted.`
            });
            return;
        }

        if (monitored === null) {
            let delNum = await Comic.deleteOne({ comicName: name });
            // console.log(`delNum: ${delNum.deletedCount}`)
            if (delNum.deletedCount > 0) {
                await interaction.editReply({
                    content: `Comic **${name}** was succesfully deleted.`
                });
            } else {
                await interaction.editReply({
                    content: `There was no comic with given name found.`
                });
            }

            return;

        } else {
            // let delmanyresult = await Comic.deleteMany({monitoried: 0});
            // console.log(`result: ${delmanyresult}`);

            await Comic.deleteMany({ monitored: 0 });

            await interaction.editReply({
                content: `Not-monitored comics were succesfully deleted.`
            });
            return;
        }
        
    },

    name: 'deletecomic',
    description: 'Delete specified comic or unmonitored comics.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'name',
            description: 'The comic which will be deleted.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'not-monitored',
            description: 'If set, not monitored comics will be deleted.',
            type: ApplicationCommandOptionType.Number,
            choices: [
                {
                    name: 'yes',
                    value: 1,
                },
            ],
        },
    ],
};
