export default abstract class SocketEvent {

    abstract name: string

    abstract handler(payload: any, dispatch: any, clientId: string): void

}