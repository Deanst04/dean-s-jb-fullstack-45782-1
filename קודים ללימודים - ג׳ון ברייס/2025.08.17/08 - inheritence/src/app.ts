import Cat from "./cat.js";
import Dog from "./dog.js";

const mitzi = new Cat(4, 5)
mitzi.sayMiau()
console.log(`mitzi weight ${mitzi.weight}kg`)

const lucky = new Dog(24, `border collie`)
lucky.bark()
console.log(`lucky weight ${lucky.weight}kg`)