"use strict";

(() => {

    const numbers = [3, 8, 16, 49, 5, 67, 88, 99]
    
    const getRandomPoweredNumAsync = num => new Promise((resolve, reject) => {
            setTimeout(() => {
                if (num % 7 === 0) reject(`BOOM!`)
                resolve(num ** 2)
            }, 1000)
        })

        console.log(numbers)

        console.log(numbers.map(x => x ** 2))

        console.log(numbers.map(x => console.log(x)))

        console.log(numbers.map(x => getRandomPoweredNumAsync(x)))

        Promise.all([
            getRandomPoweredNumAsync(numbers[0]),
            getRandomPoweredNumAsync(numbers[1]),
            getRandomPoweredNumAsync(numbers[2])
        ])
            .then(console.log)
            .catch(console.error)


        // Promise.all(numbers.map(getRandomPoweredNumAsync))
        //     .then(console.log)
        //     .catch(console.error)

        Promise.allSettled(numbers.map(getRandomPoweredNumAsync))
            .then(console.log)
            .catch(console.error)
})()