let num = +prompt(`please enter a number, enter a negative number to stop`)

while (num >= 0) {
    alert(`your number powered by 3 is: ${num**3}`)
    num = +prompt(`enter a negative number to stop`)
}
alert(`your number powered by 3 is: ${num**3}`)