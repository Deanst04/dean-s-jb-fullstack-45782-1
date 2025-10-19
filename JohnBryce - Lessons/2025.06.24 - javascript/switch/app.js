// const input = +prompt(`please enter a number between 1-9`)

// if(input == 1) {
//     alert(`one`);
// } else if(input == 2) {
//     alert(`two`);
// } else if(input == 3) {
//     alert(`three`);
// } else if(input == 4) {
//     alert(`four`);
// } else if(input == 5) {
//     alert(`five`);
// } else if(input == 6) {
//     alert(`six`);
// } else if(input == 7) {
//     alert(`seven`);
// } else if(input == 8) {
//     alert(`eight`);
// } else if(input == 9) {
//     alert(`nine`);
// }


// switch (input) {
//     case 1:
//         alert(`one`)
//         break;
//     case 2:
//         alert(`two`)
//         break;
//     case 3: 
//         alert(`three`)
//         break;
//     default:
//         alert(`unrecognized number`)
// }

const age = +prompt(`please enter your age`)
let price;

// if (age > 0 && age <= 5) {
//     price = "free"
// } else if (age >= 4 && age <= 13) {
//     price = "20 shekels"
// } else if (age >= 13 && age <= 19) {
//     price = "30 shekels"
// } else if (age >= 19 && age <= 65) {
//     price = "40 shekels"
// } else if (age > 65) {
//     price = "20 shekels"
// }

switch(true) {
    case age < 4:
        price = 0;
        break;
    case age < 12:
        price = 20;
        break;
    case age < 18:
        price = 30;
        break;
    case age < 65:
        price = 40;
        break;
    default:
        price = 20
        break;
}


alert(`your entrance fee is ${price}`)