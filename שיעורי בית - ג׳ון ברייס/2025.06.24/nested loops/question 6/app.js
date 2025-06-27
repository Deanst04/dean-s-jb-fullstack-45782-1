let num1 = +prompt(`please enter a width`);
let num2 = +prompt(`please enter a height`)

for(let height = 1; height <= num2; height++) {
    for(let width = 1; width <= num1; width++) {
        document.write(` *`)
    }
    document.write(`<br>`)
}
