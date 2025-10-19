"use strict";

(() => {

    const showTime = () => {
        console.log(`start`)
        const now = new Date().toLocaleTimeString();
        setTimeout(() => {
            console.log(now)
        }, 3000)
        console.log(`end`)
    }

    showTime();
})()