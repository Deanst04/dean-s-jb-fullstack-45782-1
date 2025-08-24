"use strict";

(() => {

    const getAverage = numbers => {
        if (typeof numbers === undefined) throw new Error("input must be defined");
        if (typeof numbers === null) throw new Error("input mustn't be null");
        if (isNaN(numbers)) throw new Error("input must not be NaN");
        if (!Array.isArray(numbers)) throw new Error("the input must be an array");
        if (numbers.length === 0) throw new Error("the array must not be empty");
        
        return numbers.reduce((acc, num) => acc + num, 0) / numbers.length
    }

    
    document.getElementById(`calc-btn`).addEventListener(`click`, () => {
        const size = +prompt(`enter array size`)
        const numbers = [];
        for (let i = 0; i < size; i++) {
            numbers.push(+prompt(`enter a number`));
        }

        try {
        const average = getAverage(numbers);
        console.log(`average is ${average}`)
        }
        catch (err) {
            alert(err);
        }
    })
})();