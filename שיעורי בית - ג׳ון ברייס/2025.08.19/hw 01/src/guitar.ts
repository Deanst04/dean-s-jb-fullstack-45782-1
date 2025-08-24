import Instruments from "./instrument.js";

export default class Guitar extends Instruments {
    constructor(model: string, maker: string, color: string, public strings: number) {
        super(model, maker, color)
    }

    display(): void {
        super.display()
        console.log(`number of strings: ${this.strings}`)
    }
    
    makeSound(): void {
        console.log("Making guitar sounds");
    }
    
}