const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Comic = require('../../models/Comic.js');
const displayComic = require('../../utils/displayComic.js');


module.exports = {

    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const monitored = interaction.options.get('monitored')?.value;
        const comicName = interaction.options.get('name')?.value;
        let comics = {};
        let message = '';

        if (comicName) {
            const query = {
                comicName: comicName,
            };
            comics = await Comic.find(query);

        } else if (monitored === undefined) {
            comics = await Comic.find({});
        } else {
            if (monitored) {
                const query = { monitored: 1 };
                comics = await Comic.find(query);
            } else {
                const query = { monitored: 0 };
                comics = await Comic.find(query);
            }
        };

        if (comics.length == 0) {
            message = 'There are no comics found.';
        } else {
            for (const comic of comics) {
                message += displayComic(comic);
            };
        }
        
        interaction.editReply({
            content: message,
        });
        return;

    },

    name: 'listcomic',
    description: 'Lists comics esisting in the database.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'name',
            description: 'Lists database content for given comic.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'monitored',
            description: 'Lists monitored/not monitored comics.',
            type: ApplicationCommandOptionType.Integer,
            choices: [
                {
                    name: 'monitored',
                    value: 1,
                },
                {
                    name: 'not monitored',
                    value: 0,
                }
            ]
        },
    ],
};
