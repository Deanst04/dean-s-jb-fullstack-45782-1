const randomArrayOf20XAndY = [];

const x = () => Math.floor(Math.random() * 100 + 1);
const y = () => Math.floor(Math.random() * 100 + 1);

for (let i = 0; i < 20; i++) {
  randomArrayOf20XAndY.push({
    x: x(),
    y: y(),
  });
}
console.log(randomArrayOf20XAndY);

console.log(`question 1`)
randomArrayOf20XAndY.forEach((cord) => console.log(cord));
console.log(`<========================>`)

console.log(`question 2`)
console.log(randomArrayOf20XAndY.find(cord => cord.x > cord.y));
console.log(`<========================>`)

console.log(`question 3`)
console.log(randomArrayOf20XAndY.find(cord => cord.y > 50));
console.log(`<========================>`)

console.log(`question 4`)
console.log(randomArrayOf20XAndY.filter(cord => cord.x % 2 !== 0));
console.log(`<========================>`)

console.log(`question 5`)
console.log(randomArrayOf20XAndY.filter(cord => cord.y > 50));
console.log(`<========================>`)

console.log(`question 6`)
console.log(randomArrayOf20XAndY.findIndex(cord => cord.x > 50));
console.log(`<========================>`)

console.log(`question 7`)
randomArrayOf20XAndY.forEach((cord) => {
    console.log(`the distance between (${cord.x}, ${cord.y}) to (0, 0) is ${Math.sqrt((cord.x**2) + (cord.y**2)).toFixed(2)}`);
})
console.log(`<========================>`)

console.log(`question 8`)
const minX = randomArrayOf20XAndY.reduce((acc, curr) => curr.x < acc ? curr.x : acc, randomArrayOf20XAndY[0].x)
console.log(`the min x is: ${minX}`);
console.log(`<========================>`)

console.log(`question 9`)
const minXCord = randomArrayOf20XAndY.reduce((acc, curr) => curr.x < acc.x ? curr : acc, randomArrayOf20XAndY[0])
console.log(`the cord with the min x is: (${minXCord.x}, ${minXCord.y})`);
console.log(`<========================>`)
