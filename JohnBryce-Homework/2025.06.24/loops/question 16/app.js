let num = +prompt(`please enter a number, enter 0 to stop`)

while (num != 0) {
    num % 7 === 0 ? alert(`המספר מתחלק ב-7 ללא שארית`) : alert(`המספר לא מתחלק ב-7 ללא שארית`)
    num = +prompt(`please enter a number, enter 0 to stop`)
}
