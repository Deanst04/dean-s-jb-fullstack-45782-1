let num = +prompt(`please enter a number`)

for (let row = 1; row <= num; row++) {
    for(let i = 1; i <= row; i++) {
        document.write(`${i} `)
    }
    document.write(`<br>`)
}