import Shape from "./shape.js";
export default class Square extends Shape {
    calcArea(rib) {
        return rib ** 2;
    }
}
