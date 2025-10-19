"use strict";

(() => {

    const showUserLocation = callback => {
        navigator.geolocation.getCurrentPosition(position => {
            const cords = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
            callback(cords)
        }, err => {
            callback(err.message)
        })
    }


    document.getElementById("show-cords").addEventListener(`click`, () => {
        showUserLocation(cords => {
            document.getElementById("cords").innerHTML = cords
        })
    })

})()