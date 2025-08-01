"use strict";

(() => {

    const randomColor = () => {
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        return `rgb(${r}, ${g}, ${b})`
    }

    setInterval(() => {
        document.body.style.backgroundColor = randomColor();
    }, 1000)

})()