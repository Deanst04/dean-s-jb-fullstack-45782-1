let num = +prompt(`please enter a number`)

for (let row = 0; row < num; row++) {
    for(let i = num - row; i >= 1; i--) {
        document.write(`* `)
    }
    document.write(`<br>`)
}