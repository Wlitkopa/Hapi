
const { createLogger, format, transports } = require('winston');


    logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
        ),
        transports: [
            new transports.File({ filename: './log/hapi.log' })
        ]
    });

module.exports = logger;

