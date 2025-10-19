import Car from "./car.js";
import RaceCar from "./Race-car.js";

const car1 = new Car((Math.floor(Math.random() * 100000)), `kia`, `stonic`, `red`, 1000)
car1.getCarData()

console.log(`<---------------->`)

const raceCar1 = new RaceCar((Math.floor(Math.random() * 100000)), `bugatti`, `chiron`, `blue`, 8000, 360, 6)
raceCar1.getRaceCarDetails()