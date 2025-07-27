"use strict";

(() => {

    const getEvenRandomNumberAfterDelay = (min, max, callback) => {
        console.log(`func started`)
        setTimeout(() => {
            let random = Math.floor(Math.random() * (max - min + 1) + min)
            random = random % 2 !== 0 ? random - 1 : random
            callback(random)
        }, 5000)
        console.log(`func ended`)
    }

    

    document.getElementById("btn").addEventListener(`click`, () => {
        console.log(`event started`)
        const first = +document.getElementById("user-first").value
        const last = +document.getElementById("user-last").value
        getEvenRandomNumberAfterDelay(first, last, num => {
            document.getElementById("container").innerHTML = num;
            console.log(num);
        })
        console.log(`event finished`)
    })
})()