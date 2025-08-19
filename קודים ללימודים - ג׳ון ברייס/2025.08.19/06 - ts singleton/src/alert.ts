class AlertLogger {

    message(message: string): void {
        alert(message)
    }

}

const alertLogger = new AlertLogger()
export default alertLogger