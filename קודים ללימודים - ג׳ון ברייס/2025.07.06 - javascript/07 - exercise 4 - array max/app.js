const grades = [90, 80, 78];
const ages = [12, 24, 55, 66, 34, 21, 33];

function findMaxItemOfArray(array, label) {
    let max = array[0];
    for (const item of array) {
        max = item > max ? item : max
    }
    document.write(`max ${label} is ${max}<br>`);
}

findMaxItemOfArray(grades, `grade`);
findMaxItemOfArray(ages, `age`);