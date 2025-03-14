# m3c5s-log
A Winston logging wrapper.

#

```js
import { createSessionLoggerFactory } from "m3c5s-log";

const sessionLoggerFactory = createSessionLoggerFactory({
    appName: <required>,
    appInstanceUUID: <required-generate-uuid>,
    k8sNodeName: <optional-provided-by-k8s>,
    k8sPodName: <optional-provided-by-k8s>,
    k8sPodUID: <optional-provided-by-k8s>,
    logDirectory: <required>,
});

// during a request that is short lived
{
    const logger = sessionLoggerFactory->getLogger();

    logger.log({ message: "message 1" });
    logger.log({ message: "message 2" });
}
```
