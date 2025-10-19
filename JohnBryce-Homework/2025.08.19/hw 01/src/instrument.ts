export default abstract class Instruments {
    constructor(public model: string, public maker: string, public color: string) {}

    display(): void {
        console.log(`model: ${this.model}, maker: ${this.maker}, color: ${this.color}`)
    }

    abstract makeSound(): void
}