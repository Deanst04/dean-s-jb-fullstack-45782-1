"use strict";

(() => {

    const drawEmoji = n => {
        if (n <= 0) return
        console.log(`😊`)
        drawEmoji(n - 1)
    }

    drawEmoji(+prompt(`please enter a number`));
})()