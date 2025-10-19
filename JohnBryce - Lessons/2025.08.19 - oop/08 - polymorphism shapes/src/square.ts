import Shape from "./shape.js";

export default class Square extends Shape {
    
    calcArea(rib: number): number {
        return rib ** 2
    }

}