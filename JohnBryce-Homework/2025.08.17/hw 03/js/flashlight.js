export default class Flashlight {
    turnOn() {
        console.log(`the flashlight is on...`);
    }
    turnOff() {
        console.log(`the flashlight is off...`);
    }
    changeBatteries(amount) {
        console.log(`You’ve just changed ${amount} out of ${this.numberOfBatteries} batteries`);
    }
    getFlashlightDetails() {
        console.log(`flashlight details:`);
        console.log(`the flashlight color is: ${this.color}`);
        console.log(`the flashlight length is: ${this.length}cm`);
        console.log(`the flashlight brightness is: ${this.lightBrightness}`);
        console.log(`the flashlight got ${this.numberOfBatteries} batteries`);
    }
    constructor(color, length, lightBrightness, numberOfBatteries) {
        this.color = color;
        this.length = length;
        this.lightBrightness = lightBrightness;
        this.numberOfBatteries = numberOfBatteries;
    }
}
