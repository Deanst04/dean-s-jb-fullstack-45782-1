let width = +prompt(`please enter a width`)
let height = +prompt(`please enter a height`)

document.write("<pre>")

for (let row = 1; row <= height; row++) {
    for (let col = 1; col <= width; col++) {
        if (row === 1 || row === height || col === 1 || col === width) {
            document.write(`* `)
        } else {
            document.write(`  `)
        }
    }
    document.write(`<br>`)
}

document.write("</pre>")