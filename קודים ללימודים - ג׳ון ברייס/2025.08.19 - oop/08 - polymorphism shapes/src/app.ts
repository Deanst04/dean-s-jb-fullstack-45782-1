import Rectangle from "./rectangle.js";
import Square from "./square.js";
import Circle from "./circle.js";
import Shape from "./shape.js";

const shape = +prompt(`enter 1 for square, 2 for rectangle, 3 for circle`)

function getShape(shape: number): Shape {
    switch(shape) {
        case 1:
            return new Square()
        case 2:
            return new Rectangle()
        case 3:
            return new Circle()
        default:
            throw new Error("error");
    }
}

const actualShape = getShape(shape)

console.log(`area of shape is: ${actualShape.calcArea(10)}`)