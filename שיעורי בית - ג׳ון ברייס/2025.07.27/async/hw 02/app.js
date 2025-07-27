"use strict";

(() => {

    const showTime = () => {
        console.log(`start`)
        setTimeout(() => {
            const now = new Date();
            console.log(now.toLocaleTimeString())
        }, 3000)
        console.log(`end`)
    }

    showTime();
})()