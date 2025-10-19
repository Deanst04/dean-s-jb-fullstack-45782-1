import Piano from "./piano.js";
export default class GrandPiano extends Piano {
    constructor(model, maker, color, keys, length) {
        super(model, maker, color, keys);
        this.length = length;
    }
    display() {
        super.display();
        console.log(`length of the piano: ${this.length}`);
    }
}
