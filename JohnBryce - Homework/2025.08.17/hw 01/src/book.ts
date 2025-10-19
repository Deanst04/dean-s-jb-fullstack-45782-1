export default class Book {
    name: string
    author: string
    publish: string
    price: number

    getBookDetails() {
        console.log(`book name: ${this.name}`)
        console.log(`book author: ${this.author}`)
        console.log(`book publisher: ${this.publish}`)
        console.log(`book price: ${this.price}`)
    }

    getBookPriceAndVat() {
        return this.price * 1.18
    }

    constructor(name: string, author: string, publish: string, price: number) {
        this.name = name
        this.author = author
        this.publish = publish
        this.price = price
    }
}