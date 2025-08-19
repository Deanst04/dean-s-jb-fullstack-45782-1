class AlertLogger {
    static getInstance() {
        return AlertLogger.instance;
    }
    message(message) {
        alert(message);
    }
    constructor() { }
}
AlertLogger.instance = new AlertLogger();
export default AlertLogger;
