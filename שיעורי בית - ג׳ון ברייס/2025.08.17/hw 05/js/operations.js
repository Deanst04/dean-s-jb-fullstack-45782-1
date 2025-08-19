export default class ArrayOperations {
    static getSum(arr) {
        return arr.reduce((acc, number) => acc + number, 0);
    }
    static getAvg(arr) {
        const sum = arr.reduce((acc, number) => acc + number, 0);
        return (sum / arr.length).toFixed(2);
    }
    static getMax(arr) {
        return arr.reduce((acc, number) => number = number > acc ? number : acc, arr[0]);
    }
    static getMin(arr) {
        return arr.reduce((acc, number) => number = number < acc ? number : acc, arr[0]);
    }
}
