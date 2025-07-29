"use strict";

(() => {
    const getRandomPoweredNumAsync = num => {
        return new Promise((resolve, reject) => {
            console.log(`event started`)
            setTimeout(() => {
                if (num % 7 === 0) reject(`${num} is 7BOOM!`)
                else resolve(num ** 2)
            }, 1000)
            console.log(`event ended`)
        })
    }


    getRandomPoweredNumAsync(+prompt(`enter a number`)).then(success => {
        console.log(`promise started`)
        console.log(success)
        console.log(`promise ended`)
    }).catch(err => {
        console.log(`promise started`)
        console.log(err);
        console.log(`promise ended`)
    })
})()