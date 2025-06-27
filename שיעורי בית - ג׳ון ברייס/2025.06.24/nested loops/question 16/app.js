let num = +prompt(`please enter a number`)

document.write(`<pre>`)
for (let row = 1; row <= num; row++) {
    for (let space = 1; space <= num-row; space++) {
        document.write(`  `)
    }
    for (let i = 1; i <= row; i++) {
        document.write(`${i} `)
    }
    for (let reverseI = row-1; reverseI >= 1; reverseI--) {
        document.write(`${reverseI} `)
    }
    document.write(`<br>`)
}
document.write(`</pre>`)