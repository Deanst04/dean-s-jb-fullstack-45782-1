import Instruments from "./instrument.js";
export default class Drum extends Instruments {
    constructor(model, maker, color, diameter) {
        super(model, maker, color);
        this.diameter = diameter;
    }
    display() {
        super.display();
        console.log(`diameter of the drum: ${this.diameter}`);
    }
    makeSound() {
        console.log("Drum is making sound");
    }
}
