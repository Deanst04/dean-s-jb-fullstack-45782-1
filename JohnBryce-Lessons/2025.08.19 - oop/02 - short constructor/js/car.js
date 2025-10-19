class Car {
    // constructor(make: string, model: string, engineVolume: number, yearModel: number) {
    //     this.make = make
    //     this.model = model
    //     this.engineVolume = engineVolume
    //     this.yearModel = yearModel
    //     Car.count++
    // }
    /*
    if you mentioned the access modifier within the constructor argument list, TS know to:
    1. declare the variable as member
    2. accept them to the constructor
    3. make the assignment automatically
    */
    constructor(make, model, engineVolume, yearModel) {
        this.make = make;
        this.model = model;
        this.engineVolume = engineVolume;
        this.yearModel = yearModel;
        Car.count++;
    }
    static getInstances() {
        return Car.count;
    }
}
// make: string
// model: string
// engineVolume: number
// yearModel: number
Car.count = 0;
export default Car;
