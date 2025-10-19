let num1 = +prompt(`please enter a number`)
let num2 = +prompt(`please enter another number`)

min = num1 > num2 ? num2 : num1
max = num1 > num2 ? num1 : num2

for (let i = min; i <= max; i++) document.write(`${i} \n`)