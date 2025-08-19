import Shape from "./shape.js";

export default class Rectangle extends Shape {
    
    calcArea(height: number): number {
        return height * 20
    }

}