"use strict";

(() => {


    const getArrayFromServerAsync = size => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const n = Math.floor(Math.random() * 100);
                if (n % 2 === 0) {
                    const arr = [];
                    for (let i = 0; i < size; i++) {
                        const random = Math.floor(Math.random() * (n))
                        arr.push(random);
                    }
                    resolve(`${n} is an even number, [${arr}]`)
                } 
                else reject(`error, ${n} is an odd number`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        const userSize = +document.getElementById("usr-size").value
        getArrayFromServerAsync(userSize).then(success => {
            document.getElementById("message").innerText = success
            console.log(success)
        }).catch(fail => {
            document.getElementById("message").innerText = fail
            console.log(fail)
        })
    })

})()