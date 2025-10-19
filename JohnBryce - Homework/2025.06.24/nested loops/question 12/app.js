let num = +prompt(`please enter a number`)

for (let row = 1; row <= num; row+= 2) {
    for (let i = 1; i <= row; i++) {
        document.write(`${i} `)
    }
    document.write(`<br>`)
}
num-=2
for (let reverseRow = num; reverseRow >= 1; reverseRow-=2) {
    for (let reverseI = 1; reverseI <= reverseRow; reverseI++) {
        document.write(`${reverseI} `)
    }
    document.write(`<br>`)
}