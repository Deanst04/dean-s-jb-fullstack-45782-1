let max;

for(let i = 1; i <= 10; i++) {
    let num = +prompt(`please enter a number`)
    max = num >= max || max === undefined ? num : max
}

document.write(`the largest number is ${max}`)