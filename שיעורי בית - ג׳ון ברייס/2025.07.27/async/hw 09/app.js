"use strict";

(() => {

    const getRandomNumberAfterDelay = (callback, lim) => {
        console.log(`func started`)
        setTimeout(() => {
            const random = Math.floor(Math.random() * lim)
            callback(random)
        }, 5000)
        console.log(`func ended`)
    }

    

    document.getElementById("btn").addEventListener(`click`, () => {
        console.log(`event started`)
        const limit = +document.getElementById("user-lim").value
        getRandomNumberAfterDelay(num => {
            document.getElementById("container").innerHTML = num;
            console.log(num);
        }, limit)
        console.log(`event finished`)
    })
})()