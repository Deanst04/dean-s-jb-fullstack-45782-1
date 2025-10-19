export default class phone {
    turnOn() {
        console.log(`device is on`);
    }
    turnOff() {
        console.log(`device is off`);
    }
    takePic() {
        console.log(`say cheese.....`);
    }
    constructor(model, screenSize, price, gen) {
        this.model = model;
        this.screenSize = screenSize;
        this.price = price;
        this.gen = gen;
    }
}
