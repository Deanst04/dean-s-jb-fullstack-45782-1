let num = +prompt(`please enter a number, enter 0 or negative number to stop`)
let rep = 0;

while(num > 0) {
    for (let i = 0; num > 0; i++) {
        num = (num - num%10)/10
        rep+=1
    }
    alert(`your number has ${rep} digits`)
    num = +prompt(`please enter a number, enter 0 or negative number to stop`)
    rep = 0;
}