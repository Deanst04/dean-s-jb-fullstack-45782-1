import Instruments from "./instrument.js";
export default class Piano extends Instruments {
    constructor(model, maker, color, keys) {
        super(model, maker, color);
        this.keys = keys;
    }
    display() {
        super.display();
        console.log(`number of keys: ${this.keys}`);
    }
    makeSound() {
        console.log("Piano is making sound");
    }
    test() {
        console.log("Testing a piano");
    }
    tune() {
        console.log("Tuning a piano");
    }
}
