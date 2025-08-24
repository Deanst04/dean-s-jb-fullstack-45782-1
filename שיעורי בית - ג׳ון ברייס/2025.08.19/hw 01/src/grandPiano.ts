import Tester from "./tester.js";
import Piano from "./piano.js";

export default class GrandPiano extends Piano implements Tester {
    constructor(model: string, maker: string, color: string, keys: number, public length: number) {
        
    }
}