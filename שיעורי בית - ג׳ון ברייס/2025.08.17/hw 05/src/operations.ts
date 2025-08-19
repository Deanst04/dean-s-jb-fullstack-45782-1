export default class ArrayOperations {

    static getSum(arr: number[]) {
       return arr.reduce((acc, number) => acc + number, 0)
    }

    static getAvg(arr: number[]) {
        const sum = arr.reduce((acc, number) => acc + number, 0)
        return (sum / arr.length).toFixed(2)
    }

    static getMax(arr: number[]) {
        return arr.reduce((acc, number) => number = number > acc ? number : acc, arr[0])
    }

    static getMin(arr: number[]) {
        return arr.reduce((acc, number) => number = number < acc ? number : acc, arr[0])
    }
}