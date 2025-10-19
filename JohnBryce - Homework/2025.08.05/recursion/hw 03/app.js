"use strict";

(() => {

    const countDivisibleOrEndsWith7  = n => {
        if (n <= 0) return
        
        if(n % 7 === 0 || JSON.stringify(n).endsWith(`7`)) console.log(n)
        countDivisibleOrEndsWith7(n - 1)
    }

    countDivisibleOrEndsWith7 (+prompt(`please enter a number`));
})()