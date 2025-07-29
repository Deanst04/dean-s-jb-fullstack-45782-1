"use strict";

(() => {

    const isPrime = num => {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false
        }
        return true
    }

    const generatePrimeNumberAfterDelayAsync = (min, max) => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const random = Math.floor(Math.random() * (max - min + 1) + min)
                if (isPrime(random)) resolve(`${random} is PRIME!`)
                else reject(`${random} is NOT PRIME`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        const minNum = +document.getElementById("min-num").value
        const maxNum = +document.getElementById("max-num").value
        generatePrimeNumberAfterDelayAsync(minNum, maxNum).then(num => {
            document.getElementById("random-num").innerText = num
        }).catch(msg => {
            document.getElementById("random-num").innerText = msg
        })
    })

})()