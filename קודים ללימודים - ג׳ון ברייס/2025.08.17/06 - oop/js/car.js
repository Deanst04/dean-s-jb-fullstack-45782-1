class Car {
    // methods (e.g. functions)
    ignite() {
        console.log(`car igniting...`);
    }
    getPrice() {
        return this.price * Car.vat;
    }
    constructor(make, model, engineVolume, yearModel, price) {
        this.make = make; // this will always refer to the object that owns the function
        this.model = model;
        this.engineVolume = engineVolume;
        this.yearModel = yearModel;
        this.engineNumber = Math.random() * 1000000; // constructor is the ONLY place where you can change readonly 
        this.price = price;
    }
}
Car.vat = 1.18;
export default Car;
