// not shorten

function sayHello() {
  console.log("hello");
}

function doSomething(callback) {
  callback();
}

doSomething(function sayHello() {
  console.log("hello");
});

function sum(a, b, c) {
  console.log(a + b + c);
}

function divide(a, b) {
  const result = a / b;
  return result;
}

function isNegative(num) {
  if (num < 0) {
    console.log("negative");
    return true;
  }
  return false;
}

// shorten

const sayHello = () => console.log(`hello`);

//////////////////////////////////////////////

const doSomething = callback => callback();

//////////////////////////////////////////////

doSomething((sayHello));
doSomething(() => console.log(`hello`));

//////////////////////////////////////////////

const sum = (a, b, c) => console.log(a + b + c);

//////////////////////////////////////////////

const divide = (a, b) => a / b;
const divide = (a, b) => {const result = a / b; result};

//////////////////////////////////////////////

const isNegative = num => {
  if (num < 0) {
    console.log("negative");
    return true;
  }
  return false;
};
