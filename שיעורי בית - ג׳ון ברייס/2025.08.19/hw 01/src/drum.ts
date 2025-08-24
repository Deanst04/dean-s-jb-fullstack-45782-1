import Instruments from "./instrument.js";

export class Drum extends Instruments {
    
    constructor(model: string, maker: string, color: string, public diameter: number) {
        super(model, maker, color)
    }

    display(): void {
        super.display()
        console.log(`diameter of the drum: ${this.diameter}`)
    }
    
    makeSound(): void {
        console.log("Drum is making sound");
    }
    
}