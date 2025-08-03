"use strict";

(async () => {
    
    const getData = url => fetch(url).then(result => result.json())

    const fetchCity = city => getData(`http://api.weatherapi.com/v1/current.json?key=5062f08033134315b8f133146250208&q=${city}`)

    const generateWeatherHTML = ({ location : { name, country }, current: { temp_c, condition : { text, icon } } }) => 
        `
            <p>The weather in ${name}, ${country} is: ${temp_c}°C</p>
            <p>Condition: ${text}</p>
            <img src="${icon}" alt="${text}">
        `

    const renderCityHTML = html => {
        document.getElementById("weather").innerHTML = html
    }

    document.getElementById("get-weather").addEventListener(`click`, async () => {

        try {
            const currentCity = document.getElementById("city-select").value
            const city = await fetchCity(currentCity)
            const html = generateWeatherHTML(city)
            renderCityHTML(html)
            console.log(`success, ${currentCity} chosen`)
        } catch (err) {
            console.log(err)
        }
    })
})()