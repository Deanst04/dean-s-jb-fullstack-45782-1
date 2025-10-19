let even = 0;
let odd = 0;

let num = +prompt(`please enter a number, enter a negative number to stop`)
num % 2 === 0 ? even++ : odd++

while (num > 0) {
    num = +prompt(`please enter a number, enter a negative number to stop`)
    num % 2 === 0 ? even++ : odd++
}

document.write(`you entered ${even} even numbers <br> you entered ${odd} odd numbers`)