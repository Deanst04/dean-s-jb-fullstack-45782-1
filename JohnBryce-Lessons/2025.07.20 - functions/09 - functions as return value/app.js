const getCalculator = op => {
  switch(op) {
    case `+`:
      return (a, b) => a + b
    case `-`:
      return (a, b) => a - b
    case `*`:
      return (a, b) => a * b
  }
}

// const calcFunction = getCalculator(`-`);
// const calcFunction = getCalculator(`+`);
const calcFunction = getCalculator(`*`);

console.log(calcFunction);
console.log(calcFunction(9, 5));