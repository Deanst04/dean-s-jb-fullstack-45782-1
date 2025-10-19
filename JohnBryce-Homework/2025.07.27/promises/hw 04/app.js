"use strict";

(() => {

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekendDays = ["Friday", "Saturday"];

    const generateWorkingDayAfterDelayAsync  = () => {
        return new Promise((resolve, reject) => {

            setTimeout(() => {
                const random = Math.floor(Math.random() * (daysOfWeek.length))
                if (!weekendDays.includes(daysOfWeek[random])) resolve(`${daysOfWeek[random]} is A WORKING DAY!`)
                else reject(`${daysOfWeek[random]} is A WEEKEND DAY!`)
            }, 1000)
        })
    }

    document.getElementById("get-rand").addEventListener(`click`, () => {
        console.log(`clicked`)
        generateWorkingDayAfterDelayAsync().then(workDays => {
            document.getElementById("message").innerText = workDays
            console.log(workDays)
        }).catch(weekendDays => {
            document.getElementById("message").innerText = weekendDays
            console.log(weekendDays)
        })
    })

})()