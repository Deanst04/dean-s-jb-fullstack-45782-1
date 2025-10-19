"use strict";

(() => {

    const getRandomNumberAfterDelay = callback => {
        setTimeout(() => {
           const random = Math.floor(Math.random() * 101)
           callback(random)
        }, 5000)
    }

    

    document.getElementById("btn").addEventListener(`click`, () => {
        getRandomNumberAfterDelay(num => {
            document.getElementById("container").innerText = num;
        })
    })
})()