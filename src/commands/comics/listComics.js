const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, Constants } = require('discord.js');
const Comic = require('../../models/Comic.js');


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const monitored = interaction.options.get('monitored')?.value || null;
        const comicName = interaction.options.get('comic-name')?.value || null
        let comics = {};
        let message = '';


        if (comicName) {
            const query = {
                comicName: comicName,
            };

            comics = await Comic.find(query);

        } else if (!monitored) {
            comics = await Comic.find({});
        } else {
            if (monitored == 1) {
                const query = {
                    monitored: 1,
                };
                comics = await Comic.find(query);
            } else {
                const query = {
                    monitored: 0,
                };
                comics = await Comic.find(query);
            }
        };

        // console.log(`comics: ${comics}`);

        if (comics.length == 0) {
            message = 'There are no comics found.';
        } else {
            for (const comic of comics) {
                message += `name: ${comic.comicName}
                url: <${comic.comicUrl}>
                previousChapter: ${comic.previousChapter}
                monitored: ${comic.monitored}\n`;
            };
        }
        
        interaction.editReply({
            content: message,
        });
        return;

    },

    name: 'listcomics',
    description: 'Adds comic to be monitored.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'monitored',
            description: 'Lists monitored/not monitored comics.',
            type: ApplicationCommandOptionType.Number,
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
        {
            name: 'comic-name',
            description: 'Lists database content for given comic.',
            type: ApplicationCommandOptionType.String,
        }
    ],
};
