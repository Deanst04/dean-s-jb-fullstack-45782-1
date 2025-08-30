export default class Backup<T> {
    constructor(public subject: string, public value: T) {}

    display(): string {
        console.log(`subject: ${this.subject}`)
        if (this.value && typeof this.value === `object` && `toString` in this.value) {
            return `value: ${this.value.toString()}`
        } else {
            return `value: ${this.value}`
        }
    }
}