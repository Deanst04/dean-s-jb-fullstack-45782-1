// const numbers = [];
// const max = 80;
// const min = 20;
// let random = Math.random(parseInt(random * (max - min + 1)) + min)

// for (let i = 1; i <= 20; i++) {
//   random = Math.random(parseInt(random * (max - min + 1)) + min)
//   numbers.push(random);
// }

// console.log(numbers);

const randomNumbers = [];

for (let i = 1; i <= 20; i++) {
  randomNumbers.push(parseInt(Math.random() * (80 - 20 + 1) + 20));
  console.log(randomNumbers[i])
}
// for (const randomNum of randomNumbers) console.log(randomNumbers);
  

