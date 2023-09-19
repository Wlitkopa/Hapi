
const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getAllFiles = require('../../utils/getAllFiles');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {

    try {
        const localCommands = getLocalCommands(['misc']);
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );
            
            if (existingCommand) {
                if (localCommand.delete) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`  Deleted command "${name}".`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });

                    console.log(`  Edited command "${name}"`)
                }
                
            } else {
                if (localCommand.delete) {
                    console.log(`  Skipping registering command "${name}" as it's set to delete.`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options
                });

                console.log(`  Registered command "${name}".`)

            };

        };

    
    } catch (error) {
        console.log(`There was an error: ${error}`)
    }


};

