"use strict";

(() => {


    const getPizzaFromServerAsync = () => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const n = Math.floor(Math.random() * 100);
                if (n % 2 === 0) {
                    const pizza = {
                        diameter: Math.floor(Math.random() * (50 - 10 + 1) + 10),
                        price: Math.floor(Math.random() * (80 - 20 + 1) + 20),
                        toppings: Math.floor(Math.random() * 5),
                    };
                    resolve(`${n} is an even number, here is your pizza: ${JSON.stringify(pizza)}`)
                } 
                else reject(`error, ${n} is an odd number, there is no pizza for you`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        getPizzaFromServerAsync().then(success => {
            document.getElementById("message").innerText = success
            console.log(success)
        }).catch(fail => {
            document.getElementById("message").innerText = fail
            console.log(fail)
        })
    })

})()