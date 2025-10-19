let num1 = +prompt(`please enter a number`)
let num2 = +prompt(`please enter a number`)
let num3 = +prompt(`please enter a number`)

if (num1 >= num2 && num1 >= num3) alert(`${num1} is the largest`)
else if (num2 >= num1 && num2 >= num3) alert(`${num2} is the largest`)
else alert(`${num3} is the largest`)