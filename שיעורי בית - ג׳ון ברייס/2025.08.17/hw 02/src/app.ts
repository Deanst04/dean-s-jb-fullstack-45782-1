import Speaker from "./speaker.js";

const bose = new Speaker(`black`, 15)
bose.turnOn()
bose.turnOff()
bose.makeSound()
bose.getSpeakerDetails()

console.log(`<---------------------->`)

const jbl = new Speaker(`red`, 23)
jbl.turnOn()
jbl.turnOff()
jbl.makeSound()
jbl.getSpeakerDetails()



