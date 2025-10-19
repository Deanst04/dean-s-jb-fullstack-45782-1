"use strict";

(() => {


    const generate7BoomAfterDelayAsync = (min, max) => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const random = Math.floor(Math.random() * (max - min + 1) + min)
                if (random % 7 === 0 || random.toString().endsWith(`7`)) resolve(`${random} is BOOM!`)
                else reject(`${random} is NOT BOOM`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        const minNum = +document.getElementById("min-num").value
        const maxNum = +document.getElementById("max-num").value
        generate7BoomAfterDelayAsync(minNum, maxNum).then(num => {
            document.getElementById("random-num").innerText = num
        }).catch(msg => {
            document.getElementById("random-num").innerText = msg
        })
    })

})()