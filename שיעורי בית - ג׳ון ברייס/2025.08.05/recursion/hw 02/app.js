"use strict";

(() => {

    const countFromNTo1 = n => {
        if (n <= 0) return
        console.log(n)
        countFromNTo1(n - 1)
    }

    countFromNTo1(+prompt(`please enter a number`));
})()