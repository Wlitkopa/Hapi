const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const checkNewChapter = require("./checkNewChapter.js");
const displayComic = require('./displayComic.js');
const Comic = require('../models/Comic.js');



module.exports = async (comics) => {
    replyContent = ``;


    for (let comic of comics) {

        let newChapter = await checkNewChapter(comic);

        // If new chapter exists
        if (newChapter) {

            replyContent += `There is new chapter for **${comic.comicName}**:\n    Previous Chapter: ${comic.previousChapter}\n    New chapter: ${newChapter}!\n\n`

            comic.previousChapter = newChapter;
            await comic.save().catch((error) => {
                console.log(`Error saving updated comic: ${error}`);
            });
        }
    }

    return replyContent;

}