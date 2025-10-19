"use strict";

(() => {

    const displayRandomNum = () => {
        console.log(`start`)
        const randomNum = () => Math.floor(Math.random() * 100)


        setTimeout(() => {
            console.log(randomNum());
        }, 3000)

        setTimeout(() => {
            console.log(randomNum());
        }, 5000)

        setTimeout(() => {
            console.log(randomNum());
        }, 7000)

        console.log(`end`)
    }

    displayRandomNum();
})()