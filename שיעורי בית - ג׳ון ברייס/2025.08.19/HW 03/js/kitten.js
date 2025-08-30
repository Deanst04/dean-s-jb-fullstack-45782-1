export default class Kitten {
    constructor(name, color, age) {
        this.name = name;
        this.color = color;
        this.age = age;
    }
    toString() {
        return `The kitten ${this.name} is ${this.age} years old and he is a ${this.color}`;
    }
}
