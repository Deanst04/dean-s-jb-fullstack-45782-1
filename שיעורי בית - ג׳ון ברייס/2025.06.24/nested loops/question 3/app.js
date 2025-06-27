let num = +prompt(`enter a number, enter 0 or a negative number to stop`);

while (num > 0) {
    for (let first = 2; first < num; first += 2) {
        alert(`${first}`);
    }
    num = +prompt(`enter a number, enter 0 or a negative number to stop`);
}
