"use strict";

(async () => {
  
  // [1, 9, 17, 25, 33, 49, 51, 66, 72, 82, 92]
  // [1, 9, 17, 25, 33, 49] , [51, 66, 72, 82, 92]
  // [51, 66, 72] , [82, 92]


  const numbers = [1, 9, 17, 25, 33, 49, 51, 66, 72, 82, 92] // sorted array
  const searchSortedArray = (array, search) => {
    let startIndex = 0;
    let finishIndex = array.length

    do {
      let currentIndex = Math.floor((startIndex + finishIndex) / 2)
      if (array[currentIndex] === search) return currentIndex

      if (array[currentIndex] > search) finishIndex = currentIndex - 1
      else startIndex = currentIndex + 1
    } while (finishIndex >= startIndex)

      return -1
  }
  

  // O(log2n) // in what power of 2 do i have to use to get to n




  // const numbers2 = [1, 9, 17, 25, 33, 49, 51, 66, 72, 82, 92] // unsorted array

  const num = +prompt(`enter a number`)

  // let the user know if the number is in the array?
  const itemIndex = searchSortedArray(numbers, num)

  // do it in the smallest way possible
  console.log(`item offset is ${itemIndex}`)
  console.log(`${num} is ${itemIndex !== -1 ? `included` : `not included`} in the array`)


})();
