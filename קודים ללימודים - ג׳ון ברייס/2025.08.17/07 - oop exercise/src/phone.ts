export default class phone {
    model: string
    screenSize: number
    price: number
    gen: number

    turnOn() {
        console.log(`device is on`)
    }

    turnOff() {
        console.log(`device is off`)
    }

    takePic() {
        console.log(`say cheese.....`)
    }

    constructor(model: string, screenSize: number, price: number, gen: number) {
        this.model = model
        this.screenSize = screenSize
        this.price = price
        this.gen = gen
    }
}