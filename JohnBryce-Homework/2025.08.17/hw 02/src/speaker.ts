export default class Speaker {
    color: string
    volume: number

    turnOn() {
        console.log(`the speaker is turned on`)
    }

    turnOff() {
        console.log(`the speaker is turned off`)
    }

    makeSound() {
        console.log(`the speaker is making sound`)
    }

    getSpeakerDetails() {
        console.log(`speaker color: ${this.color}`)
        console.log(`speaker volume: ${this.volume}`)
    }

    constructor(color: string, volume: number) {
        this.color = color
        this.volume = volume
    }
}