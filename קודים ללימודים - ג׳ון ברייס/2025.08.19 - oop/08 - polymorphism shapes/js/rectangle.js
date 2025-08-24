import Shape from "./shape.js";
export default class Rectangle extends Shape {
    calcArea(height) {
        return height * 20;
    }
}
