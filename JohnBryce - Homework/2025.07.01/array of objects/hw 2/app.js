const clothes = [
    {
        type: `t-shirt`,
        size: `large`,
        price: 89,
        color: `black`,
    },
    {
        type: `jeans`,
        size: `32`,
        price: 120,
        color: `darkblue`,
    },
    {
        type: `shoes`,
        size: `45`,
        price: 230,
        color: `black`,
    },
    {
        type: `socks`,
        size: `45`,
        price: 35,
        color: `white`,
    },
    {
        type: `jacket`,
        size: `large`,
        price: 99,
        color: `black`,
    },
];

for (const cloth of clothes) {
    for (const prop in cloth) {
        console.log(`${prop}: ${cloth[prop]}`);
    }
};