let num = +prompt(`enter a number, enter 0 or a negative number to stop`);
num = num % 2 === 0 ? num-2 : num-1

while (num > 0) {
    for (let first = num; first > 2; first -= 2) {
        alert(`${first}`);
    }
    num = +prompt(`enter a number, enter 0 or a negative number to stop`);
    num = num % 2 === 0 ? num-2 : num-1
}
