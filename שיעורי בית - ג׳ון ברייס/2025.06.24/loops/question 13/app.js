let first = +prompt(`please enter a number`)
let last = +prompt(`please enter another number`)
let num = +prompt(`please enter another number`)


for (let i = first; i <= last; i++) {
    if(i % num === 0) document.write(`${i} \n`)
}