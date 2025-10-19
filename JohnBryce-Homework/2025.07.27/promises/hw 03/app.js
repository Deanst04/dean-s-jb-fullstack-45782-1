"use strict";

(() => {

    const animals = ["kitten", "puppy", "bunny", "parakeet", "scorpion", "spider", "cockroach"];
    const cuteAnimals = ["kitten", "puppy", "bunny", "parakeet"];

    const generateCuteAnimalAfterDelayAsync  = () => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const random = Math.floor(Math.random() * (animals.length))
                if (cuteAnimals.includes(animals[random])) resolve(`${animals[random]} is CUTE!`)
                else reject(`${animals[random]} is NOT CUTE`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        generateCuteAnimalAfterDelayAsync().then(cute => {
            document.getElementById("message").innerText = cute
        }).catch(msg => {
            document.getElementById("message").innerText = msg
        })
    })

})()