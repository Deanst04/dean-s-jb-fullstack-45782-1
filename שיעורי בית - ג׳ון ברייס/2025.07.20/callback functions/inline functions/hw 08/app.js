setInterval(function displayRandomNumber() {
    document.getElementById("display-random-number").innerHTML = `${parseInt(Math.random() * (100)) + 1}`
}, 1 * 1000);