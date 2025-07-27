"use strict";

(() => {

  // by value - arguments NEVER affect the value of the parameter they origin from
  // immutable objects - cannot be changed
  const calc = (a,b) => {
    a++
    return a + b
  }

  let a = 3;
  let b = 4;

  console.log(`${calc(3, 4)} is the result of ${a} + ${b}`)

  // by reference - arguments that are objects, share the same memory space
  // and therefore any change that I do inside a function
  // has effect also outside the function
  // immutable objects - cannot be changed - very very very DANGEROUS
  const calcObject = (a,b) => {
    a.value++
    return a.value + b.value
  }

  const objA = {
    value: 25
  }

  const objB = {
    value: 30
  }

  console.log(
    `${calcObject(objA, objB)} is the result of ${objA.value} + ${objB.value}`
  )

})()