import Instruments from "./instrument.js";
import Tester from "./tester.js";

export default class Piano extends Instruments implements Tester {
    
    constructor(model: string, maker: string, color: string, public keys: number) {
        super(model, maker, color)
    }

    display(): void {
        super.display()
        console.log(`number of keys: ${this.keys}`)
    }

    makeSound(): void {
        console.log("Piano is making sound");
    }

    test(): void {
        console.log("Testing a piano");
    }
    tune(): void {
        console.log("Tuning a piano");
    }
}
