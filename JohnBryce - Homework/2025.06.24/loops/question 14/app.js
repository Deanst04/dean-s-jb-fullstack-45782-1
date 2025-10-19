let first = +prompt(`please enter a number`)
let last = +prompt(`please enter another number`)
let num = +prompt(`please enter another number`)

let min = first < last ? first : last
let max = last > first ? last : first


for (let i = min; i <= max; i++) {
    if(i % num === 0) document.write(`${i} \n`)
}
