const array1 = [`dog`, `fish`, `snake`];
const array2 = [`banana`, `apple`, `watermelon`];
const array3 = [`cucumber`, `pumpkin`, `carrot`];
const ArrayOfArrays = [array1, array2, array3];

function getMaxStringLengthOfArray(array) {
  let max = 0;
  for (const string of array) {
    max = string.length > max ? string.length : max;
  }
  return max;
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(
  `the max length of a string from the array [${array1}] is: ${getMaxStringLengthOfArray(
    array1
  )}`
);
displaySeparationLine();
document.write(
  `the max length of a string from the array [${array2}] is: ${getMaxStringLengthOfArray(
    array2
  )}`
);
displaySeparationLine();
document.write(
  `the max length of a string from the array [${array3}] is: ${getMaxStringLengthOfArray(
    array3
  )}`
);
displaySeparationLine();
