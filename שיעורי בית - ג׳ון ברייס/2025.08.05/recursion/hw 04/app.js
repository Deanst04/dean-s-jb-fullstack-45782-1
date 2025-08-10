"use strict";

(() => {

    const n = +prompt(`please enter a number`)
    const calcSumOfNumbersBetween1ToN  = n => {
        if (n <= 1) return n
        
        return n + calcSumOfNumbersBetween1ToN(n - 1)
    }

    console.log(`the sum of the numbers between 1 to ${n} is: ${calcSumOfNumbersBetween1ToN(n)}`);
})()