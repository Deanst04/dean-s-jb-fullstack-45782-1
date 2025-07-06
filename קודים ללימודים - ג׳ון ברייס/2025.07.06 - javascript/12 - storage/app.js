// const user = {
//     id: 232,
//     name: `israel israeli`,
// };

// // // non persistent cookie
// // if (document.cookie) document.cookie = JSON.stringify(user);

// sessionStorage.setItem(`userData`, JSON.stringify(user));

// console.log(sessionStorage.getItem(`userData`));

let numberOfVisits = localStorage.getItem(`numberOfVisits`) || 0;
numberOfVisits++
localStorage.setItem(`numberOfVisits`, numberOfVisits);
console.log(numberOfVisits);