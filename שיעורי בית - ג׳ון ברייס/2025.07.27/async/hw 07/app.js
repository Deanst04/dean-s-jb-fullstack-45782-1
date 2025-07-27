"use strict";

(() => {

    // document.getElementById("btn").addEventListener(`click`, () => {
    //     document.body.style.backgroundColor = "Green";
    //     alert("Done");
    // })

    // 1. NO, first the web alert `done` and only after that the background changing his color
    // 2. the current result is because the changing background command is in queue and waiting for the backstack to be empty
    // 3. the solution is to make the wrap the alert in an async function, like this:

    document.getElementById("btn").addEventListener(`click`, () => {
        document.body.style.backgroundColor = "Green";
        setTimeout(() => {
            alert("Done");
        }, 1000)
    })
})()