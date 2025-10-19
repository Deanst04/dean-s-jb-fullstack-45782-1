export default class Speaker {
    turnOn() {
        console.log(`the speaker is turned on`);
    }
    turnOff() {
        console.log(`the speaker is turned off`);
    }
    makeSound() {
        console.log(`the speaker is making sound`);
    }
    getSpeakerDetails() {
        console.log(`speaker color: ${this.color}`);
        console.log(`speaker volume: ${this.volume}`);
    }
    constructor(color, volume) {
        this.color = color;
        this.volume = volume;
    }
}
