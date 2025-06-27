let num = +prompt(`please enter a number`)
let dig = 0;

if (num === 0) dig++
else {
while (num != 0) {
    dig++
    num = (num - num % 10)/10
}
}

document.write(`your number has ${dig} digits`)