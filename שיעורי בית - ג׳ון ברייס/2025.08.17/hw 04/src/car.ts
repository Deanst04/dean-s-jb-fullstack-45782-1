export default class Car {
    readonly carNumber: number
    readonly brand: string
    readonly model: string
    color: string
    readonly engineVolume: number

    getCarData() {
        console.log(`your car number is: ${this.carNumber}`)
        console.log(`your car brand is: ${this.brand}`)
        console.log(`your car model is: ${this.model}`)
        console.log(`your car color is: ${this.color}`)
        console.log(`your car engine volume is: ${this.engineVolume}`)
    }

    constructor(carNumber: number, brand: string, model: string, color: string, engineVolume: number) {
        this.carNumber = carNumber
        this.brand = brand
        this.model = model
        this.color = color
        this.engineVolume = engineVolume
    }
}