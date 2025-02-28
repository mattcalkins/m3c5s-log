import winston from "winston";

let currentDay = undefined;
let logger= undefined;


/**
 *
 */
function createLogger(apiName, day, logDirectory) {
    return winston.createLogger({
        level: "info",
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.printf(info => JSON.stringify(info))
        ),
        transports: [
            //new winston.transports.Console(),
            new winston.transports.File({ filename: `${logDirectory}/${apiName}-${day}.jsonl` })
        ]
    });
}


/**
 *
 */
export function getLogger(apiName, logDirectory = ".") {
    const validApiName = /^[a-zA-Z0-9-]+$/.test(apiName);

    console.log(`apiName: ${apiName}`);
    console.log(`validApiName: ${validApiName}`);

    if (typeof apiName !== "string" || validApiName === false) {
        throw new Error(`The apiName argument of ${apiName} is not valid. Only letters, numbers, and hyphens are allowed.`);
    }

    const today = new Date().toISOString().split('T')[0];

    if (today !== currentDay) {
        currentDay = today;
        logger = createLogger(apiName, currentDay, logDirectory);
    }

    return {
        log: (message, level = "info") => logger.log({message, level}),
    };
}
