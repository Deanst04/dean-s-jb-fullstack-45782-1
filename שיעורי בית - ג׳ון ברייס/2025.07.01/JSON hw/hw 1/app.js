const books = [
    {
    code: 101,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 79.90
  },
  {
    code: 102,
    title: "1984",
    author: "George Orwell",
    price: 69.90
  },
  {
    code: 103,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 85.00
  }
];

const booksJson = JSON.stringify(books);
alert(booksJson);

const items = JSON.parse(booksJson);
console.log(books);
console.log(items);

for (const item of items) {
        document.write(`Book ID: ${item.code} <br>`);
        document.write(`Book Name: ${item.title} <br>`);
        document.write(`Book Author: ${item.author} <br>`);
        document.write(`Book Price: ${item.price} <br>`);
        document.write(`<br>-------------------------<br>`);
};