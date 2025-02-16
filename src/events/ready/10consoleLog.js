
const logger = require('../../utils/logger');

module.exports = (client) => {
    console.log(`   ${client.user.tag} is online!`);
    logger.info(`${client.user.tag} is online!`);
};
