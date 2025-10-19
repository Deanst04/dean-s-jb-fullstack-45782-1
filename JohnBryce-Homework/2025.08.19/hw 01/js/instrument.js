export default class Instruments {
    constructor(model, maker, color) {
        this.model = model;
        this.maker = maker;
        this.color = color;
    }
    display() {
        console.log(`model: ${this.model}, maker: ${this.maker}, color: ${this.color}`);
    }
}
