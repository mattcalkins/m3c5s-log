const { createSessionLoggerFactory, errorUUIDs } = require("m3c5s-log");
const { getAttachedUUID } = require("attach-uuid");

const appInstanceUUID = "0195b49c-9635-749a-a62d-5eb1454415ad";

const sessionLoggerFactory = createSessionLoggerFactory({
    appInstanceUUID: appInstanceUUID,
    appName: "cjs-test-1",
    logDirectory: "./logs",
});
