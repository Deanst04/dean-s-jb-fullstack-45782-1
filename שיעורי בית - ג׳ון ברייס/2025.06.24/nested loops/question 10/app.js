let num = +prompt(`please enter a number`)

for(let row = 1; row <= num; row++) {
    for(let i = 1; i <= row; i++) {
        document.write(`${i} `)
    }
    document.write(`<br>`)
}
for(let reverseRow = num; reverseRow >= 1; reverseRow--) {
    for(let reverseI = 1; reverseI <= reverseRow; reverseI++) {
        document.write(`${reverseI} `)
    }
    document.write(`<br>`)
}