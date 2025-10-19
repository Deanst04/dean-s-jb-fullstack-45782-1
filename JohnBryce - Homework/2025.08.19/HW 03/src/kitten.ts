export default class Kitten {
    constructor(public name: string, public color: string, public age: number) {}

    toString(): string {
        return `The kitten ${this.name} is ${this.age} years old and he is a ${this.color}`
    }
}