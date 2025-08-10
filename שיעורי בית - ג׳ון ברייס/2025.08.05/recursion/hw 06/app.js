"use strict";

(() => {

    const num = +prompt(`please enter a number`)
    const displayNumbersFrom1ToN  = (current, n) => {

        if (current > n) return
        console.log(current)
        displayNumbersFrom1ToN(current + 1, n)
    }

    displayNumbersFrom1ToN(1, num)

})()