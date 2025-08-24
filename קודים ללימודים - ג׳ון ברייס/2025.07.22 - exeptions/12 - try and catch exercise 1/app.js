const userCode = prompt(`please enter a JS code`);
try {
eval(userCode);
console.log(`in try block`);
}
catch (err) {
    if (err.message) alert(`your JS code is invalid, ${err.message}`);
}