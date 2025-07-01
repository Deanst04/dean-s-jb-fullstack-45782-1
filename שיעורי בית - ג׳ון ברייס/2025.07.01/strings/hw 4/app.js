const password = prompt(`please enter your password`);

let hasDigit = false;
let hasUpper = false;
let hasLower = false;
let hasSymbol = false;

for (let i = 0; i < password.length; i++) {
if (password[i] >= `a` && password[i] <= `z`) hasLower = true;
else if (password[i] >= `A` && password[i] <= `Z`) hasUpper = true;
else if (password[i] >= `0` && password[i] <= `9`) hasDigit = true;
else hasSymbol = true;
};

if (password.length < 6) {
    alert(`the password is weak because its too short`);
}
else if (!hasLower) {
    alert(`the password is weak because its missing a lower case letter`);
}
else if (!hasUpper) {
    alert(`the password is weak because its missing an upper case letter`);
}
else if (!hasDigit) {
    alert(`the password is weak because its missing digits`);
}
else if (!hasSymbol) {
    alert(`the password is weak because its missing symbols`);
}
else alert(`the password is strong`);
