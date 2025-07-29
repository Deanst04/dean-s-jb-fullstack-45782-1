"use strict";

(() => {


    const generateStrongPasswordAsync = () => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const lower = `abcdefghijklmnopqrstuvwxyz`.split(``);
                const upper = lower.map((char) => char.toUpperCase())
                const numbers = `123456789`.split(``);
                const allChars = [...lower, ...upper, ...numbers];

                let password = ``;
                for (let i = 0; i < 6; i++) {
                    password += allChars[Math.floor(Math.random() * (allChars.length))]
                }

                let hasUpper = false
                let hasLower = false
                let hasNum = false

                password.split(``).forEach(char => {
                    if (lower.includes(char)) hasLower = true
                    else if (upper.includes(char)) hasUpper = true
                    else if (numbers.includes(char)) hasNum = true
                })
                if (!hasLower) reject(`ERROR, the random password: ${password}, doesn't includes lowercase`)
                else if (!hasUpper) reject(`ERROR, the random password: ${password} doesn't includes uppercase`)
                else if (!hasNum) reject(`ERROR, the random password: ${password} doesn't includes numbers`)
                else resolve(`${password} includes lowercase, uppercase and number`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        generateStrongPasswordAsync().then(success => {
            document.getElementById("message").innerText = success
            console.log(success)
        }).catch(fail => {
            document.getElementById("message").innerText = fail
            console.log(fail)
        })
    })

})()