const getPriceWithVat = price => {
    if (isNaN(price)) throw new Error("price must be a number");
    return price * 1.18
}

const price = +prompt(`enter a price`);

try {
    alert(`price with vat is ${getPriceWithVat(price)}`)
} catch (err) {
    console.log(`there was an error: ${err.message}`)
}

