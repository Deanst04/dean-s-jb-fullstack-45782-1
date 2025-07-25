"use strict";

(() => {
  const getAverage = (arr) => {
    if (arr === undefined || arr === null) throw new Error("the array cannot be undefined or null");
    if (!Array.isArray(arr)) throw new Error("the input must be an array");
    if (arr.length === 0) throw new Error("the array must contain any value");

    return (arr.reduce((acc, curr) => acc + curr, 0) / arr.length).toFixed(2);
  };

  const getArr = () => {
    try {
    const userArr = [];
    const size = +prompt(`enter a size of an array`);
      for (let i = 0; i < size; i++) {
        const userNum = +prompt(`please enter a number`);
        userArr.push(userNum);
      }
      console.log(userArr);
      document.getElementById("sum-container").innerHTML = getAverage(userArr);
    } catch (error) {
      console.log(error);
      document.getElementById("sum-container").innerHTML = `something went wrong, please try again`;
    }
  };

  document.getElementById("size").addEventListener(`click`, getArr);
})();
