const rectangle = {
    width: 7,
    height: 4,
    color: `blue`,
    xAxis: 0,
    yAxis: 10,
};

console.log(rectangle)


for (const prop in rectangle) {
    console.log(`${prop}: ${rectangle[prop]}`)
}