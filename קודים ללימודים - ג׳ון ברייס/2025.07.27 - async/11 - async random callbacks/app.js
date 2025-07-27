"use strict";

(() => {
  const getAsyncRandomNumber = (max, callback) => {
    setTimeout(() => {
      const random = Math.random() * max;
      console.log(`got max ${max}`);
      callback(random);
    }, 1000);
  };

  getAsyncRandomNumber(100, nextMax => {
    getAsyncRandomNumber(nextMax, nextMax => {
      getAsyncRandomNumber(nextMax, nextMax => {
        getAsyncRandomNumber(nextMax, nextMax => {
          getAsyncRandomNumber(nextMax, nextMax => {
            getAsyncRandomNumber(nextMax, nextMax => {
              getAsyncRandomNumber(nextMax, nextMax => {
                getAsyncRandomNumber(nextMax, nextMax => {
                  getAsyncRandomNumber(nextMax, nextMax => {
                    getAsyncRandomNumber(nextMax, nextMax => {
                        console.log(nextMax)
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
})();
