"use strict";

(() => {

    const getRandomNumberAfterDelay = (min, max, callback) => {
        console.log(`func started`)
        setTimeout(() => {
            const random = Math.floor(Math.random() * (max - min + 1) + min)
            callback(random)
        }, 5000)
        console.log(`func ended`)
    }

    

    document.getElementById("btn").addEventListener(`click`, () => {
        console.log(`event started`)
        const first = +document.getElementById("user-first").value
        const last = +document.getElementById("user-last").value
        getRandomNumberAfterDelay(first, last, num => {
            document.getElementById("container").innerHTML = num;
            console.log(num);
        })
        console.log(`event finished`)
    })
})()