"use strict";

(() => {

    function getUserFromServer(callback) {
    setTimeout(() => {
        // Demo for getting user from the server:
        const user = { firstName: "Moishe", lastName: "Ufnik" }
        // "Return" that user to the calling code.
        callback(user);
    }, 4000);
}

getUserFromServer(console.log);
})()