const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Comic = require('../../models/Comic.js');
const displayComic = require('../../utils/displayComic.js')


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */


    callback: async (client, interaction) => {
        const name = interaction.options.get('name')?.value;

        await interaction.deferReply();
        var message = '';

        // Last-read value must be updated for one, specified comic
        if (name != undefined) {
            const query = { comicName: name };
            const dbComic = await Comic.findOne(query);

            // Comic with given name exists in database
            if (dbComic) {
                if (dbComic.previousChapter == dbComic.lastRead) {
                    message = 'You have already read all chapters :)';
                } else {
                    dbComic.lastRead = dbComic.previousChapter;
                    await dbComic.save().catch((error) => {
                        console.log(`Error saving updated comic: ${error}`);
                        message = 'Error saving updated comic.'
                        interaction.editReply({
                            content: message,
                        })
                        return;
                    });
                    message = 'Nice! I will notify You about new chapter if comic is monitored :).'
                };
                await interaction.editReply({
                    content: message,
                });

            // Comic with given name doesn't exist in database
            } else {
           
            await interaction.editReply({
                content: `There is no comic with given name.`,
            })
            return;

        }
        // TODO: Last-read value must be upadted for all monitored comics
        } else {
            const query = { monitored: 1 };
            const comics = await Comic.find(query);
        };



    },

    name: 'readToLast',
    description: 'Updates last-read chapter value to the previous-chapter value.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'name',
            description: 'The comic which chapters .',
            type: ApplicationCommandOptionType.String,
        },
    ],
};

