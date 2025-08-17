const carMake = `Opel`
const carModel = `Corsa`
const engineVolume = 1300
const yearModel = 2012

function ingniteCar() {
    console.log(`igniting....`)
}

// i can describe object in reality by combination
// of variables and functions

const corsa1 = {
    make: `Opel`,
    model: `Corsa`,
    engineVolume: 1300,
    yearModel: 2012,
    ignite: () => { console.log(`igniting....`) }
}

const corsa2 = {
    make: `Opel`,
    model: `Corsa`,
    engineVolume: 1300,
    yearModel: 2012,
    ignite: () => { console.log(`ignited....`) }
}