import Shape from "./shape.js";
export default class Circle extends Shape {
    calcArea(radius) {
        return radius * radius * Math.PI;
    }
}
