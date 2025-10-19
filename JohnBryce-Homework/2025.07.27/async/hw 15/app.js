"use strict";

(() => {
    let intervalStarted = false;

    const randomColor = () => {
        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        return `rgb(${r}, ${g}, ${b})`
    }


    const showCurrentTime = callback => {
        setInterval(() => {
            const now = new Date().toLocaleTimeString()
            callback(now)
        }, 1000)
    }


    document.getElementById("show-time").addEventListener(`click`, () => {

        if (intervalStarted) return
        else intervalStarted = true;

        showCurrentTime(currentTime => {
            document.getElementById("current-time").innerText = currentTime
            document.getElementById("current-time").style.color = randomColor()
        })
    })

})()