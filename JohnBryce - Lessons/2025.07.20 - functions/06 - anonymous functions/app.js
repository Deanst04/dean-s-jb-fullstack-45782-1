function somePower(num, func) {
    if (typeof func !== `function`) alert(`big error, no function found`);
    console.log(`result of ${num} and ${func} is ${func(num)}`);
}

somePower(4, function (num) {return num**2});

somePower(4, function (num) {return num**3});

somePower(4, console.log);