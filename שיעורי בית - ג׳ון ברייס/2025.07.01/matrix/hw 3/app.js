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
let maxProducts = [];
let minProducts = [];

for (let row = 0; row < products.length; row++) {
  for (let col = 0; col < products[row].length; col++) {
    let currentItem = products[row][col];
    let currentLength = currentItem.length;
    if (currentLength < minLength) {
      minLength = currentLength;
      minProducts.length = 0;
      minProducts.push(currentItem);
    } else if (currentLength === minLength) {
      minProducts.push(currentItem);
    };
    if (currentLength > maxLength) {
      maxLength = currentLength;
      maxProducts.length = 0;
      maxProducts.push(currentItem);
    } else if (currentLength === maxLength) {
      maxProducts.push(currentItem);
    }
  }
};


document.write(`<br>the longest items are: ${maxProducts}, `);
document.write(`<br>the shortest items are: ${minProducts}, `);


