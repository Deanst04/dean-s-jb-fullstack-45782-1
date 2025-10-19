"use strict";

(() => {

    const randArr = []
    for (let i = 0; i < 10; i++) {
        const randomNum = Math.floor(Math.random() * 101)
        randArr.push(randomNum)
    }


    const calcSumOfEvenNumbers = (index, arr) => {

        if (arr[index] === undefined) return 0

        if (arr[index] % 2 === 0) {
            return arr[index] + calcSumOfEvenNumbers(index + 1, arr)
        } else {
            return calcSumOfEvenNumbers(index + 1, arr)
        }
    }

    console.log(`the sum of the even numbers in [${randArr}] is: ${calcSumOfEvenNumbers(0, randArr)}`)
})()