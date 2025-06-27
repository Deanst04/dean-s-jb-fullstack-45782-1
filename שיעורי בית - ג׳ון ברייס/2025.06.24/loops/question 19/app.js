let sum = 0;
let avg = 0;

for(let i = 1; i <= 10; i++) {
    let num = +prompt(`please enter a number`)
    sum += num;
    avg = sum / i
}

document.write(`the sum of your numbers is: ${sum} <br> the average of your numbers is: ${avg}`)