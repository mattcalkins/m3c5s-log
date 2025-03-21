import { createSessionLoggerFactory, errorUUIDs } from "../src/index.mjs";
import { v7 as uuidv7 } from "uuid";


const badLogDirectory = "/one/bad/directory/";
const goodLogDirectory = "./tests/test-logs";

const badAppInstanceUUID = "not-a-uuid";
const goodAppInstanceUUID1 = "01955f37-c314-7539-a843-ff72a6fe48c2";
const goodAppInstanceUUID2 = "01955f38-3101-71ff-ab00-edafa5200376";

const goodAppName = "test-app-1";


/**
 *
 */
function runTests() {
    let actualErrorUUID = undefined;
    let expectedErrorUUID = undefined;
    let testName = undefined;
    let testPassed = undefined;
    let lastError = undefined;


    // test

    testName = "Call createSessionLoggerFactory with undefined appName";
    lastError = undefined;
    actualErrorUUID = undefined;
    expectedErrorUUID = errorUUIDs.invalidAppName;

    try {
        createSessionLoggerFactory({
            appInstanceUUID: goodAppInstanceUUID1,
            appName: undefined,
            logDirectory: badLogDirectory,
        });
    } catch (error) {
        lastError = error;
        actualErrorUUID = error.UUID;
    }

    if (actualErrorUUID !== expectedErrorUUID) {
        console.log(`The test "${testName}" failed. Expected error UUID ${expectedErrorUUID} but got ${actualErrorUUID}.`);
        throw lastError;
    }


    // test

    testName = "Call createSessionLoggerFactory with empty appName";
    lastError = undefined;
    actualErrorUUID = undefined;
    expectedErrorUUID = errorUUIDs.invalidAppName;

    try {
        createSessionLoggerFactory({
            appInstanceUUID: goodAppInstanceUUID1,
            appName: "",
            logDirectory: badLogDirectory,
        });
    } catch (error) {
        lastError = error;
        actualErrorUUID = error.UUID;
    }

    if (actualErrorUUID !== expectedErrorUUID) {
        console.log(`The test "${testName}" failed. Expected error UUID ${expectedErrorUUID} but got ${actualErrorUUID}.`);
        throw lastError;
    }


    // test
    testName = "Call createSessionLoggerFactory with bad log directory";
    lastError = undefined;
    actualErrorUUID = undefined;
    expectedErrorUUID = errorUUIDs.logDirectoryIsNotWritable;

    try {
        createSessionLoggerFactory({
            appInstanceUUID: goodAppInstanceUUID1,
            appName: goodAppName,
            logDirectory: badLogDirectory,
        });
    } catch (error) {
        lastError = error;
        actualErrorUUID = error.UUID;
    }

    if (actualErrorUUID !== expectedErrorUUID) {
        console.log(`The test "${testName}" failed. Expected error UUID ${expectedErrorUUID} but got ${actualErrorUUID}.`);
        throw lastError;
    }

    // test
    testName = "Call createSessionLoggerFactory with bad app instance UUID";
    lastError = undefined;
    actualErrorUUID = undefined;
    expectedErrorUUID = errorUUIDs.invalidAppInstanceUUID;

    try {
        createSessionLoggerFactory({
            appInstanceUUID: badAppInstanceUUID,
            appName: goodAppName,
            logDirectory: goodLogDirectory,
        });
    } catch (error) {
        lastError = error;
        actualErrorUUID = error.UUID
    }

    if (actualErrorUUID !== expectedErrorUUID) {
        console.log(`The test "${testName}" failed. Expected error UUID ${expectedErrorUUID} but got ${actualErrorUUID}.`);
        throw lastError;
    }


    // test with good log directory and app instance UUID
    testPassed = true;

    let sessionLoggerFactory1 = createSessionLoggerFactory({
        appName: "test-app-1",
        appInstanceUUID: goodAppInstanceUUID1,
        k8sNodeName: "k8s-node-1",
        k8sPodName: "k8s-pod-1",
        k8sPodUID: "k8s-pod-uid-1",
        logDirectory: goodLogDirectory,
    });



    const logger1 = sessionLoggerFactory1.getSessionLogger();

    if (typeof logger1 !== "object") {
        throw new Error("The logger1 object is not an object.");
    }

    logger1.log({ message: "log 1 message" });

    let sessionLoggerFactory2 = createSessionLoggerFactory({
        appName: "test-app-2",
        appInstanceUUID: goodAppInstanceUUID2,
        k8sNodeName: "k8s-node-2",
        k8sPodName: "k8s-pod-2",
        k8sPodUID: "k8s-pod-uid-2",
        logDirectory: goodLogDirectory,
    });

    const logger2 = sessionLoggerFactory2.getSessionLogger();

    if (typeof logger2 !== "object") {
        throw new Error("The logger2 object is not an object.");
    }

    logger2.log({ message: "log 2 message" });

    console.log("All tests passed.");
}

runTests();
