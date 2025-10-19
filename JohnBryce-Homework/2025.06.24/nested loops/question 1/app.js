let num = +prompt(`enter a number, enter 0 or a negative number to stop`)
while(num > 0) {
    for (let first = 1; num >= first; first++) {
        alert(`${first}`)
    }
    num = +prompt(`enter a number, enter 0 or a negative number to stop`)
}