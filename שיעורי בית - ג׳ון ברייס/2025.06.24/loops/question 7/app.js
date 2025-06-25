let num = +prompt(`please enter a number`)
document.write(`1 \n`)
for(let i = 0; i <= num; i+=3) {
    if (i === 0) i = 3
    document.write(`${i} \n`)
}
document.write(`${num}`)
