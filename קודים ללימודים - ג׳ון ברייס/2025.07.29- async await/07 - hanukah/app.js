"use strict";

(async () => {

//    // the promise way: 
 const getNumberOfCandles = hanukahSerialDay => {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
      if (hanukahSerialDay > 8) reject("max day is 8");
      if (hanukahSerialDay < 1) reject("min day is 1");
      resolve(hanukahSerialDay + 1)
   }, 1000)
   })
 }

//    // Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(current => getNumberOfCandles(current)))
//    Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(getNumberOfCandles))
//       .then(result => {
//          const total = result.reduce((acc, currDay) => acc + currDay, 0)
//          console.log(`we light in total ${total} candles`)
//       })
//       .catch(console.error)

   // async / await:

   try {
      const result = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(getNumberOfCandles))
      const total = result.reduce((acc, currDay) => acc + currDay, 0)
      console.log(`we light in total ${total} candles`)
   } catch (err) {
      console.log(err)
   }
})();
