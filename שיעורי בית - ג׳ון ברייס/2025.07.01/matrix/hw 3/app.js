const products = [
["Onion", "Carrot", "Tomato", "Cucumber"],
["Apple", "Banana", "Peach", "Grapes", "Orange"],
["Wheat", "Flour"]
];


for (let row = 0; row < products.length; row++) {
  for (let col = 0; col < products[row].length; col++) {
    document.write(`${products[row][col]}, `);
  }
  document.write(`<br>`);
};

let maxLength = products[0][0].length;
let minLength = products[0][0].length;
const maxLengthArray = [];
const minLengthArray = [];
let longItem;
let shortItem;

for (let row = 0; row < products.length; row++) {
  for (let col = 0; col < products[row].length; col++) {
    let currentItem = products[row][col];
    if (currentItem.length > maxLength) {
      maxLengthArray.push(currentItem);
      longItem = currentItem;
    } else if (currentItem.length === maxLength && !currentItem.includes(products[row][col])) {
      maxLengthArray.push(currentItem);
    } else if (currentItem.length < minLength) {
      minLengthArray.push(currentItem);
      shortItem = currentItem;
    } else if (currentItem.length === minLength && !currentItem.includes(products[row][col])) {
      minLengthArray.push(currentItem);
    }
  }
  document.write(`<br>`);
};

document.write(`<br>`);
document.write(`the products with the longest names are: ${maxLengthArray}`);
document.write(`<br>`);
document.write(`the products with the shortest names are: ${minLengthArray}`);

