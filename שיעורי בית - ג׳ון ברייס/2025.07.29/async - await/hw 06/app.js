"use strict";

(async () => {
    const getData = url => fetch(url).then(result => result.json())

    document.getElementById("get-weather").addEventListener(`click`, async () => {

        const selectedCity = document.getElementById("city-select").value;

        const fetchData = async () => {
        const weather = await getData(`http://api.weatherapi.com/v1/current.json?key=5062f08033134315b8f133146250208&q=${selectedCity}`)
        return weather
    }


    try {
        const weather = await fetchData()

        const generateWeatherHTML = weather => {
        const { location : { name }, current: { temp_c, condition : { text, icon } } } = weather
        const html = `
            <p>The weather in ${name} is: ${temp_c}°C</p>
            <p>Condition: ${text}</p>
            <img src="${icon}" alt="${text}">
        ` 
        return html
    }
    
        const html = generateWeatherHTML(weather)
        document.getElementById("weather").innerHTML = html
        console.log(`success, ${selectedCity} chosen`)

    } catch (err) {
        console.log(`error: ${err}`)
    }
    })
})()