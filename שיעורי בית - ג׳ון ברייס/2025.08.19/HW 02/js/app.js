var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Yellow"] = 3] = "Yellow";
    Color[Color["White"] = 4] = "White";
})(Color || (Color = {}));
function getColorItem(color) {
    switch (color) {
        case Color.Red:
            return `an apple`;
        case Color.Blue:
            return `the sky`;
        case Color.Green:
            return `the grass`;
        case Color.Yellow:
            return `the sun`;
        case Color.White:
            return `the clouds`;
        default:
            return `no color was found`;
    }
}
console.log(getColorItem(Color.Red));
console.log(`<-------------->`);
console.log(getColorItem(Color.Blue));
console.log(`<-------------->`);
console.log(getColorItem(Color.Green));
console.log(`<-------------->`);
console.log(getColorItem(Color.Yellow));
console.log(`<-------------->`);
console.log(getColorItem(Color.White));
