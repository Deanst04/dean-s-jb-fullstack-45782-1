"use strict";

(() => {

    const colors = [`red`, `blue`, `green`, `yellow`, `purple`, `grey`, `crimson`]


    const pickColor = (callback) => {
        if (typeof callback !== `function`) throw new Error("callback must be a function");
        
        setTimeout(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length * 2)];
            if (typeof randomColor === `undefined`) throw new Error("server is currently down");
            callback(randomColor)
        }, 3000)
    }

    document.getElementById(`show-color`).addEventListener(`click`, () => {
        try {
        pickColor(color => {
            document.body.style.backgroundColor = color
        })
        }
        catch (err) {
            console.log(`error is ${err.message}`);
        }
    })

    document.getElementById(`display-color`).addEventListener(`click`, () => {
        pickColor(color => {
            alert(color)
        })
    })

})()