import CoffeeShop from "./coffee-shop.js";
import SushiShop from "./sushi-shop.js";

export default class Kitchen implements SushiShop, CoffeeShop{
    makeBlackCoffee(): void {
        console.log(`hot water small glass put in`);
    }

    makeCoffee(): void {
        console.log(`ground the beans then add hot water`);
    }

    makeSushi(): void {
        
    }

}