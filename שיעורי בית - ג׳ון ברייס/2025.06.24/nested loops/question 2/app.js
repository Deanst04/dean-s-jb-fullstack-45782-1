let num = +prompt(`enter a number, enter 0 or a negative number to stop`)
while(num > 0) {
    for (let first = num; first >= 1; first--) {
        alert(`${first}`)
    }
    num = +prompt(`enter a number, enter 0 or a negative number to stop`)
}