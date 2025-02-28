import { getLogger } from '../src/index.mjs';

function testGetLogger() {
    const logger = getLogger("api-1", "./logs");

    if (logger) {
        console.log('getLogger test passed');
    } else {
        console.log('getLogger test failed');
        return;
    }

    logger.log('log message');
}

testGetLogger();
