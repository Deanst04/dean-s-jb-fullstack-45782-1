export default class Backup {
    constructor(subject, value) {
        this.subject = subject;
        this.value = value;
    }
    display() {
        console.log(`subject: ${this.subject}`);
        if (this.value && typeof this.value === `object` && `toString` in this.value) {
            return `value: ${this.value.toString()}`;
        }
        else {
            return `value: ${this.value}`;
        }
    }
}
