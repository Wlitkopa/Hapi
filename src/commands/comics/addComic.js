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

        const name = interaction.options.get('name').value;
        const comicUrl = interaction.options.get('url').value;
        let previousChapter = interaction.options.get('previous-chapter')?.value;
        let monitored = interaction.options.get('monitored')?.value;
        let lastRead =  interaction.options.get('last-read')?.value;
        const linksReg = /(http|https):\/\/mangafire\.to[^\s]+/g;



        await interaction.deferReply();
        // console.log(`previousChapter: ${previousChapter}\nmonitored: ${monitored}`);

        const query = {
            comicUrl: comicUrl,
        };

        const dbComic = await Comic.findOne(query);


        // Comic with given url exists in the database
        if (dbComic) {

            if (dbComic.comicName != name) {
                await interaction.editReply({
                    content: `There is already comic with given url:\n${displayComic(dbComic)}`,
                })
                return;

            } else {
                let comicValues = [];
                let message = '';


                if (comicUrl != dbComic.comicUrl) {
                    dbComic.comicUrl = comicUrl;
                    comicValues.push(" comicUrl");
                };
                if (previousChapter != undefined && previousChapter != dbComic.previousChapter) {
                    dbComic.previousChapter = previousChapter;
                    comicValues.push(" previousChapter");
                };
                if (lastRead != undefined && lastRead != dbComic.lastRead) {
                    dbComic.lastRead = lastRead;
                    comicValues.push(" lastRead");
                }

                if (monitored != undefined && monitored != dbComic.monitored) {
                    dbComic.monitored = monitored;
                    comicValues.push(" monitored");
                    // comicValues[comicValues.length] = " monitored";
                };

                if (comicValues.length > 0) {
                    message = `Existing comic values were updated: ${comicValues.toString()}\n${displayComic(dbComic)}`;
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

        // Comic with given url doesn't exist in the database
        } else {

            const query2 = {
                comicName: name,
            };

            const dbComic2 = await Comic.findOne(query2);
            
            if (dbComic2) {
                await interaction.editReply({
                    content: `There is already comic with given name:\n${displayComic(dbComic2)}`,
                })
                return;
            };

            var link = comicUrl.match(linksReg) || 0;

                if (link == 0) {
                    await interaction.editReply({
                        content: 'Specify a proper comic link.',
                    })
                    return;
                }


            // Create new comic
            const newComic = new Comic({
                comicName: name,
                comicUrl: comicUrl,
                previousChapter: previousChapter,
                lastRead: lastRead,
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
            description: 'The chapter pointing the last-known chapter.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'last-read',
            description: 'Chapter indicating last-read chapter.',
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
