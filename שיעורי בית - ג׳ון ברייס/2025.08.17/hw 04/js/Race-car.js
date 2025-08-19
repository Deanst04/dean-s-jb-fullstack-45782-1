import Car from "./car.js";
export default class RaceCar extends Car {
    getRaceCarDetails() {
        console.log(`your car number is: ${this.carNumber}`);
        console.log(`your car brand is: ${this.brand}`);
        console.log(`your car model is: ${this.model}`);
        console.log(`your car color is: ${this.color}`);
        console.log(`your car engine volume is: ${this.engineVolume}`);
        console.log(`your car has max speed of: ${this.maxSpeed}`);
        console.log(`your car has been participated in ${this.raceParticipated}`);
    }
    constructor(carNumber, brand, model, color, engineVolume, maxSpeed, raceParticipated) {
        super(carNumber, brand, model, color, engineVolume);
        this.maxSpeed = maxSpeed;
        this.raceParticipated = raceParticipated;
    }
}
