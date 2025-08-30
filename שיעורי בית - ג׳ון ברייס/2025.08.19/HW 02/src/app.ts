enum Color {
    Red,
    Blue,
    Green,
    Yellow,
    White
}

function getColorItem(color: Color): string {
    switch(color) {
        case Color.Red: 
            return `an apple`
        case Color.Blue:
            return `the sky`
        case Color.Green:
            return `the grass`
        case Color.Yellow:
            return `the sun`
        case Color.White:
            return `the clouds`
        default:
            return `no color was found`

    }
}

console.log(getColorItem(Color.Red))
console.log(`<-------------->`)
console.log(getColorItem(Color.Blue))
console.log(`<-------------->`)
console.log(getColorItem(Color.Green))
console.log(`<-------------->`)
console.log(getColorItem(Color.Yellow))
console.log(`<-------------->`)
console.log(getColorItem(Color.White))
