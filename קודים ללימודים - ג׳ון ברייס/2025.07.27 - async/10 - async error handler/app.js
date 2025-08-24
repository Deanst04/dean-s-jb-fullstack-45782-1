"use strict";

(() => {

    const colors = [`red`, `blue`, `green`, `yellow`, `purple`, `grey`, `crimson`]


    const pickColor = (successCallback, errorCallback) => {
        if (typeof successCallback !== `function`) throw new Error("callback must be a function");
        
        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length * 2)];
            if (typeof randomColor === `undefined`) errorCallback("server is currently down");
            else successCallback(randomColor)
        }, 3000)
    }

    document.getElementById(`show-color`).addEventListener(`click`, () => {
        pickColor(color => {
            document.body.style.backgroundColor = color
        }, error => {
            console.log(`there was an error: ${error}`)
        })
    })

    document.getElementById(`display-color`).addEventListener(`click`, () => {
        pickColor(color => {
            alert(color)
        }, error => {
            alert(`there was an error: ${error}`)
        })
    })

})()