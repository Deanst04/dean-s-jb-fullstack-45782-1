import Shape from "./shape.js";

export default class Circle extends Shape {
    
    calcArea(radius: number): number {
        return radius * radius * Math.PI
    }
    
}