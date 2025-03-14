import fs from "fs";
import path from "path";
import { validate as validateUUID } from "uuid";
import winston from "winston";


const errorUUIDs = {
    invalidAppInstanceUUID: "01954ef3-d00d-73ee-b61a-605db05cdc64",
    invalidAppName: "01955eaa-8dbb-741f-b826-1b55b12e5e82",
    invalidLogEntry: "01955f84-bfa7-752c-8e4a-f2d267fef3a2",
    logDirectoryIsNotWritable: "01954ea7-3a35-7bd6-a25e-c5814d87adb5",
    unableToCleanUpTestFile: "01954ea9-20d6-7f21-a918-dc0b491f7125",
};


/**
 * Creates a singleton log controller object.
 *
 * @param {string} logDirectory
 * @param {string} appInstanceUUID
 *
 * @returns {object}
 */
function createSessionLoggerFactory({ appName, appInstanceUUID, k8sNodeName, k8sPodName, k8sPodUID, logDirectory }) {

    /**
     * This function creates a session logger that should be used to create log entries for a single session. A session is a relatively short period of time that a user interacts with the application. For instance, a single request is a session, app startup is a session, and app shutdown is a session. All of the logs for a session are guaranteed to be written to the same log file even if the session spans multiple days, which would generally only happen if the sesion began just before midnight and ended just after midnight.
     *
     * @returns {object}
     *
     *      {
     *         log: (message, level = "info") => void
     *      }
     */
    function createSessionLogger() {
        const day = new Date().toISOString().split('T')[0];

        const logger = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.printf(info => JSON.stringify(info))
            ),
            transports: [
                // new winston.transports.Console(),
                new winston.transports.File({ filename: `${logDirectory}/${appName}--${day}--${appInstanceUUID}.jsonl` })
            ]
        });


        /**
         * This function writes a log entry to the log file.
         *
         * @param {object} logEntry
         */
        function log(logEntry) {
            if (typeof logEntry !== "object") {
                let logEntryAsJSON = JSON.stringify(logEntry);

                const reportableError = new Error(`The logEntry argument of '${logEntryAsJSON}' is not an object.`);
                reportableError.UUID = errorUUIDs.invalidLogEntry;

                throw reportableError;
            }

            if (typeof logEntry.message !== "string" || logEntry.message.length === 0) {
                let messageAsJSON = JSON.stringify(logEntry.message);

                const reportableError = new Error(`The logEntry.message value '${messageAsJSON}' is not a non-empty string.`);
            }

            const finalLogEntry = structuredClone(logEntry);

            if (typeof finalLogEntry.level === "undefined") {
                finalLogEntry.level = "info";
            }

            finalLogEntry.appName = appName;
            finalLogEntry.appInstanceUUID = appInstanceUUID;
            finalLogEntry.k8sNodeName = k8sNodeName;
            finalLogEntry.k8sPodName = k8sPodName;
            finalLogEntry.k8sPodUID = k8sPodUID;


            logger.log(finalLogEntry);
        }


        const sessionLogger = {
            log,
        };

        return sessionLogger;
    }


    // validate the appName

    {
        let appNameIsValid = false;

        if (typeof appName === "string") {
            appNameIsValid = /^[a-zA-Z0-9-]+$/.test(appName);
        }

        if (appNameIsValid !== true) {
            const appNameAsJSON = JSON.stringify(appName);
            const reportableError = new Error(`The appName argument of '${appName}' is not valid. Only letters, numbers, and hyphens are allowed.`);
            reportableError.UUID = errorUUIDs.invalidAppName;

            throw reportableError;
        }
    }


    // validate the appInstanceUUID

    if (validateUUID(appInstanceUUID) !== true) {
        const reportableError = new Error(`The appInstanceUUID argument of ${appInstanceUUID} is not a valid UUID.`);
        reportableError.UUID = errorUUIDs.invalidAppInstanceUUID;

        throw reportableError;
    }


    // validate the logDirectory

    const testFilePath = path.join(logDirectory, "test.txt");

    try {
        fs.writeFileSync(testFilePath, "test");
    } catch (error) {
        const reportableError = new Error(`The log directory argument of ${logDirectory} is not writable. Previous error message: ${error.message}`);
        reportableError.UUID = errorUUIDs.logDirectoryIsNotWritable;

        throw reportableError;
    }

    try {
        fs.unlinkSync(testFilePath);
    } catch (error) {
        const reportableError = new Error(`Failed to clean up the log directory test file. Previous error message: ${error.message}`);
        reportableError.UUID = errorUUIDs.unableToCleanUpTestFile;

        throw reportableError;
    }

    // create the logger

    let sessionLoggerFactory = {
        getSessionLogger: () => createSessionLogger(),
    };

    return sessionLoggerFactory;
}


export {
    createSessionLoggerFactory,
    errorUUIDs,
}
