let num = +prompt(`please enter a number`)
let dig = 0;

while (num != 0) {
    dig+= num % 10
    num = (num - num % 10)/10
}

document.write(`the sum of your number's digits is: ${dig}`)