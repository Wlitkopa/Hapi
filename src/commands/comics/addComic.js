const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const Comic = require('../../models/Comic.js');


module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {

        const name = interaction.options.get('name').value;
        const comicUrl = interaction.options.get('url').value;
        let previousChapter = interaction.options.get('previous-chapter')?.value || null;
        let monitored = interaction.options.get('monitored')?.value || null;
        console.log(`1: comicUrl: ${comicUrl}\npreviousChapter: ${previousChapter}\nmonitored: ${monitored}`);
        await interaction.deferReply();


        const query = {
            comicUrl: comicUrl,
        };

        const dbComic = await Comic.findOne(query);

        // Comic with given url exists in the database
        if (dbComic) {

            if (dbComic.comicName != name) {
                await interaction.editReply({
                    content: `There is already comic with given url: ${dbComic.comicName}.`,
                })
                return;

            } else {
                let comicValues = [];
                let message = '';

                console.log(`2: comicUrl: ${comicUrl}\npreviousChapter: ${previousChapter}\nmonitored: ${monitored}`);

                if (comicUrl != dbComic.comicUrl) {
                    dbComic.comicUrl = comicUrl;
                    comicValues.push(" comicUrl");
                };
                if (previousChapter != null && previousChapter != dbComic.previousChapter) {
                    dbComic.previousChapter = previousChapter;
                    comicValues.push(" previousChapter");
                };
                if (monitored != null && monitored != dbComic.monitored) {
                    dbComic.monitored = monitored;
                    comicValues[comicValues.length] = " monitored";
                };
                console.log(comicValues.toString());
                console.log(comicValues);
                if (comicValues.length > 0) {
                    message = 'Existing comic values were updated:' + comicValues.toString();
                } else {
                    message = 'No updates to this existing comic.';
                }

                await dbComic.save().catch((error) => {
                    console.log(`Error saving updated comic: ${error}`);
                    return;
                })
    
                await interaction.editReply({
                    content: message,
                })
                return;
            };

        // Given comic doesn't exist in the database
        } else {

            if (previousChapter === undefined) {
                previousChapter = 1;
            };
            if (monitored === undefined) {
                monitored = 1;
            }

            // Create new comic
            const newComic = new Comic({
                comicName: name,
                comicUrl: comicUrl,
                previousChapter: previousChapter,
                monitored: monitored,        
            });

            await newComic.save();
            await interaction.editReply({
                content: `Comic ${name} was added!`,
            })
            return;
        }
        
    },

    name: 'addcomic',
    description: 'Adds comic to be monitored.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'name',
            description: 'The comic which will be monitored.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'url',
            description: 'The url of comic.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'previous-chapter',
            description: 'The chapter which after comic will be monitored.',
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: 'monitored',
            description: 'Specifies whether comic will be monitored.',
            type: ApplicationCommandOptionType.Number,
            choices: [
                {
                    name: 'monitored',
                    value: 1,
                },
                {
                    name: 'not monitored',
                    value: 0,
                },
            ],
        },
    ],
};
