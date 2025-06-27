let even = 0;
let odd = 0;

for(let i = 1; i <= 10; i++) {
    let num = +prompt(`please enter a number`)
    num % 2 === 0 ? even++ : odd++
}

document.write(`you entered ${even} even numbers <br> you entered ${odd} odd numbers`)