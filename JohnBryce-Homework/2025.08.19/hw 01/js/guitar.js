import Instruments from "./instrument.js";
export default class Guitar extends Instruments {
    constructor(model, maker, color, strings) {
        super(model, maker, color);
        this.strings = strings;
    }
    display() {
        super.display();
        console.log(`number of strings: ${this.strings}`);
    }
    makeSound() {
        console.log("Making guitar sounds");
    }
}
