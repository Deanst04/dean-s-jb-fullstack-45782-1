"use strict";

(async () => {

    
    const getData = url => fetch(url).then(result => result.json())
    
    const fetchUsers = async () => {
        const users = await getData(`https://dummyjson.com/recipes`)
        return users
    }

})()