const array1 = [`dog`, `fish`, `snake`];
const array2 = [`banana`, `apple`, `watermelon`];
const array3 = [`cucumber`, `pumpkin`, `carrot`];
const ArrayOfArrays = [array1, array2, array3];

function getMaxStringOfArray(array) {
  let maxString = array[0];
  for (const string of array) {
    maxString = string.length > maxString.length ? string : maxString;
  }
  return maxString;
}

function displaySeparationLine() {
  document.write(`<br>=================<br>`);
}

document.write(
  `the biggest string from the array [${array1}] is: ${getMaxStringOfArray(
    array1
  )}`
);
displaySeparationLine();
document.write(
  `the biggest string from the array [${array2}] is: ${getMaxStringOfArray(
    array2
  )}`
);
displaySeparationLine();
document.write(
  `the biggest string from the array [${array3}] is: ${getMaxStringOfArray(
    array3
  )}`
);
displaySeparationLine();
