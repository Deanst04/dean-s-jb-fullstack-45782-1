"use strict";

(() => {

  // the old callback hell:
  const getAsyncRandomNumber = (max, successCallback, errorCallback) => {
    setTimeout(() => {
      const random = Math.random() * max;
      console.log(`got max ${max}`);
      if (random > max) errorCallback(`internal server error`);
      else successCallback(random);
    }, 1000);
  };


  // // callback hell
  // getAsyncRandomNumber(100, nextMax => {
  //   getAsyncRandomNumber(nextMax, nextMax => {
  //     getAsyncRandomNumber(nextMax, nextMax => {
  //       getAsyncRandomNumber(nextMax, nextMax => {
  //         getAsyncRandomNumber(nextMax, nextMax => {
  //           getAsyncRandomNumber(nextMax, nextMax => {
  //             getAsyncRandomNumber(nextMax, nextMax => {
  //               getAsyncRandomNumber(nextMax, nextMax => {
  //                 getAsyncRandomNumber(nextMax, nextMax => {
  //                   getAsyncRandomNumber(nextMax, nextMax => {
  //                       console.log(nextMax)
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  // });

  // the new promise way:

  // promise advantage:
  // 1. formalize the success and error callback into resolve, reject
  // 2. ensure only one reject or resolve will be invoked and no more
  // 3. chaining them: "THENIFICATION"
    const getAsyncRandomNumberPromise = (max) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      const random = Math.random() * max;
      console.log(`got max ${max}`);
      if (random > max) reject(`internal server error`);
      else resolve(random);
      }, 1000);
    })
  };


  // instead of callback hell, we get THENIFICATION
  // when we use `return` from a `then` function, we actually return a new promise
  const p = getAsyncRandomNumberPromise(100);
  p.then(random => { // inside then we implement the success callback
    console.log(`promise random is: ${random}`);
    return getAsyncRandomNumberPromise(random);
  }).then((random) => {
    console.log(`promise random is: ${random}`);
    return getAsyncRandomNumberPromise(random);
  }).then((random) => {
    console.log(`promise random is: ${random}`);
    return getAsyncRandomNumberPromise(random);
  }).then((random) => {
    console.log(`promise random is: ${random}`);
    return getAsyncRandomNumberPromise(random);
  }).then((random) => {
    console.log(`promise random is: ${random}`);
    return getAsyncRandomNumberPromise(random);
  }).catch(err => {
    console.log(`there was an error: ${err}`)
  }).finally(() => {
    console.log(`in finally`)
  })
  // console.log(p);

})();
