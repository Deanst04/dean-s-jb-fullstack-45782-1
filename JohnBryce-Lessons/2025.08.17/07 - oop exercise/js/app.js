import phone from "./phone.js";
const iphone = new phone(`Iphone`, 6.9, 4000, 5);
const samsung = new phone(`samsung s25`, 6.9, 3800, 5);
console.log(`iphone screen size is: ${iphone.screenSize}`);
console.log(`samsung price is: ${samsung.price}`);
iphone.takePic();
samsung.turnOn();
