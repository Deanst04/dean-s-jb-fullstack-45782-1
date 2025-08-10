"use strict";

(() => {

    const n = +prompt(`please enter a number`)
    const calculateFactorial  = n => {
        if (n <= 1) return 1
        
        return n * calculateFactorial(n - 1)
    }

    console.log(`the factorial of ${n} is: ${calculateFactorial(n)}`);
})()