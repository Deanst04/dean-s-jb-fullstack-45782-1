"use strict";

(() => {

    const showTime = () => {
        console.log(`start`)
        const now = new Date();
        console.log(now.toLocaleTimeString())
        console.log(`end`)
    }

    showTime();
})()