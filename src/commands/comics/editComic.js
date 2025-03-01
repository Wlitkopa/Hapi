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

        const name = interaction.options.get('name').value;
        const newName = interaction.options.get('new-name')?.value;
        const newUrl = interaction.options.get('url')?.value;
        const previousChapter = interaction.options.get('previous-chapter')?.value;
        const lastRead = interaction.options.get('last-read')?.value;
        const monitored = interaction.options.get('monitored')?.value;
        const linksReg = /(http|https):\/\/[^\s]*\.[^\s]+/g;

        await interaction.deferReply();

        const query = {
            comicName: name,
        };

        const dbComic = await Comic.findOne(query);


        // Comic with given url exists in the database
        if (dbComic) {
            
            let comicValues = [];
            let message = '';


            if (newUrl != undefined && newUrl != dbComic.comicUrl) {
                var link = newUrl.match(linksReg) || 0;

                if (link == 0) {
                    await interaction.editReply({
                        content: 'Specify a proper link to be changed.',
                    })
                    return;
                }
                dbComic.comicUrl = newUrl;
                comicValues.push(" comicUrl");
            };

            if (previousChapter != undefined) {
                const floatPreviousChapter = parseFloat(previousChapter);
                if (!isNaN(floatPreviousChapter) && floatPreviousChapter != dbComic.previousChapter) {
                    dbComic.previousChapter = floatPreviousChapter;
                    comicValues.push(" previousChapter");
                } else if (isNaN(floatPreviousChapter)) {
                    message = 'Error: Chapters numbers must be provided as a float separated with a dot.'
                    interaction.editReply({
                        content: message,
                    });
                    return;
                }
            }

            if (lastRead != undefined) {
                const floatLastRead = parseFloat(lastRead);
                if (!isNaN(floatLastRead) && floatLastRead != dbComic.lastRead) {
                    dbComic.lastRead = floatLastRead;
                    comicValues.push(" lastRead");
                } else if (isNaN(floatLastRead)) {
                    message = 'Error: Chapters numbers must be provided as a float separated with a dot.'
                    interaction.editReply({
                        content: message,
                    });
                    return;
                }
            }


            if (monitored != undefined && monitored != dbComic.monitored) {
                dbComic.monitored = monitored;
                comicValues[comicValues.length] = " monitored";
            };
            if (newName != undefined && newName != dbComic.comicName) {
                dbComic.comicName = newName;
                comicValues[comicValues.length] = " comicName";
            };

            if (comicValues.length > 0) {
                message = `Existing comic attributes were updated: ${comicValues.toString()}\n${displayComic(dbComic)}`;
            } else {
                message = 'Specify comic attributes that you want to change.';
            }

            await dbComic.save().catch((error) => {
                // console.log(`Error saving updated comic: ${error}`);
                logger.error(`Error saving updated comic: ${error}`);
                message = 'Error saving updated comic.'
                interaction.editReply({
                    content: message,
                })
                return;
            })

            await interaction.editReply({
                content: message,
            })
            return;
            

        // Comic with given url doesn't exist in the database
        } else {
           
            await interaction.editReply({
                content: `There is no comic with given name.`,
            })
            return;

        }
        
    },

    name: 'editcomic',
    description: 'Edits existing comic.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // delete: true,

    options: [
        {
            name: 'name',
            description: 'The comic which will be edited.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'new-name',
            description: 'The new name of edited comic.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'url',
            description: 'The new url.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'previous-chapter',
            description: 'New chapter.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'last-read',
            description: 'New last-read chapter.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'monitored',
            description: 'Specifies whether comic will be monitored.',
            type: ApplicationCommandOptionType.Integer,
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
