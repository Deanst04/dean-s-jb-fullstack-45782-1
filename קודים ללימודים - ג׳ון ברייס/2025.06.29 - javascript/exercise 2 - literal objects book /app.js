const book = {
  author: {
    firstName: `israel`,
    lastName: `israeli`,
  },
  publish: `23.07.2004`,
  pages: 140,
  price: 80,
};

book.price = 0.8 * book.price

console.log(`price after discount is: ${book.price}`);