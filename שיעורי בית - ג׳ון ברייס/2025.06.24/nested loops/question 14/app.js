let num = +prompt(`please enter a number, enter 0 or negative number to stop`)
let dig = 0;

while(num > 0) {
    while (num > 0) {
        dig+= num%10
        num = (num - num%10)/10
    }
    alert(`the sum of your number's digits is: ${dig}`)
    num = +prompt(`please enter a number, enter 0 or negative number to stop`)
    dig = 0;
}