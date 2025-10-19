"use strict";

(() => {

    const displayRandomNum = () => {
        

        document.addEventListener(`DOMContentLoaded`, () => {
            const randomNum = max => Math.floor(Math.random() * max)
            const userMax = +prompt(`please enter a max number`)
            document.getElementById("max-number").value = userMax

            setInterval(() => {
            document.getElementById("num-container").innerHTML = randomNum(userMax)
        }, 1000)
        })

        

    }

    displayRandomNum();

})()