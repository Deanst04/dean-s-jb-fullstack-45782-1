const password = prompt(`please enter a password`);

let isSixCharsLong = password.length >= 6;
let hasCapitalLetter = password.toLowerCase() !== password;
let hasLowerCaseLetter = password.toLowerCase() === password;
let hasDigit = false;
let hasSpecialChar = false;

for (const char of password) {
  if (`01234567890`.includes(char)) hasDigit = true;
  // if (Number(char) !== NaN) hasDigit = true;
  if (`!@#$%^&*`.includes(char)) hasSpecialChar = true;
}

if (
  hasCapitalLetter &&
  hasDigit &&
  hasLowerCaseLetter &&
  hasSpecialChar &&
  isSixCharsLong
) {
  console.log(`great password`);
} else {
  console.log(`bad password, reason:`);
  if (isSixCharsLong === false) console.log(`needs more length`);
  if (hasCapitalLetter === false) console.log(`needs capital letter`);
  if (hasLowerCaseLetter === false) console.log(`needs lower case letter`);
  if (hasDigit === false) console.log(`needs number`);
  if (hasSpecialChar === false) console.log(`needs special char`);
}
