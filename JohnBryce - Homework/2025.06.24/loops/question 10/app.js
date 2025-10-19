let num1 = +prompt(`please enter a number`)
let num2 = +prompt(`please enter a number`)
let min
let max

if (num1 >= num2) {
    max = num1
    min = num2
} else if (num2 >= num1) {
    max = num2
    min = num1
}

for (let i = min;i<=max;i++) document.write(`${i} \n`)

