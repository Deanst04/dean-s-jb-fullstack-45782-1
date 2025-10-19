function displayRandomNumber() {
    document.getElementById("display-random-number").innerHTML = `${parseInt(Math.random() * (100)) + 1}<br>`
}

setInterval(displayRandomNumber, 1 * 1000);