import Animal from "./animal.js"

export default class Fish extends Animal {
    defecate(): void {
        console.log(`defecating...`);
    }
    weight: number
    isGold: boolean
}