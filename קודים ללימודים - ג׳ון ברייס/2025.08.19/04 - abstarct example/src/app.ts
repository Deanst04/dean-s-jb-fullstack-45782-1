import AlertLogger from "./alert.js";
import ConsoleLogger from "./console.js";

const logger = new AlertLogger()
logger.log(`hello world`)
logger.log(`hello world`)
logger.log(`hello world`)
logger.log(`hello world`)
logger.log(`hello world`)
logger.log(`hello world`)

const logger2 = new ConsoleLogger()
logger2.log(`hello world`)
logger2.log(`hello world`)
logger2.log(`hello world`)
logger2.log(`hello world`)
logger2.log(`hello world`)
logger2.log(`hello world`)