"use strict";

(() => {

    const randArr = []
    for (let i = 0; i < 10; i++) {
        const randomNum = Math.floor(Math.random() * 101)
        randArr.push(randomNum)
    }


    const getMaxNumber = (index, arr) => {

        if (index === arr.length - 1) return arr[index]

        const maxInRest = getMaxNumber(index + 1, arr)

        return arr[index] > maxInRest ? arr[index] : maxInRest 
        
    }

    console.log(`the max number in [${randArr}] is: ${getMaxNumber(0, randArr)}`)
})()