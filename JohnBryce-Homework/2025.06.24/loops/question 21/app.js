let min;

for(let i = 1; i <= 10; i++) {
    let num = +prompt(`please enter a number`)
    min = num <= min || min === undefined ? num : min
}

document.write(`the smallest number is ${min}`)