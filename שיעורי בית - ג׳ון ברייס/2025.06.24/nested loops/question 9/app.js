let num = +prompt(`please enter a number`)

for (let row = 1; row <= num; row++) {
    for (let i = num; i >= 1; i--) {
        document.write(`${i} `)
    }
    document.write(`<br>`)
}