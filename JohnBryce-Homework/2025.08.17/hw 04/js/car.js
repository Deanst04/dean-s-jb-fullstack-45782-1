export default class Car {
    getCarData() {
        console.log(`your car number is: ${this.carNumber}`);
        console.log(`your car brand is: ${this.brand}`);
        console.log(`your car model is: ${this.model}`);
        console.log(`your car color is: ${this.color}`);
        console.log(`your car engine volume is: ${this.engineVolume}`);
    }
    constructor(carNumber, brand, model, color, engineVolume) {
        this.carNumber = carNumber;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.engineVolume = engineVolume;
    }
}
