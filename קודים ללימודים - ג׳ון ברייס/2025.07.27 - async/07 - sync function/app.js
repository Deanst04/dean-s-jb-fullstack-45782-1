"use strict";

(() => {

    const user = {
        id: 123,
        name: `israel israeli`
    }

    ////////////////////////////

    const showUser = () => {
        console.log(`function started`)
        console.log(user)
        console.log(`function started`)
    }

    document.getElementById(`show-user`).addEventListener(`click`,() => {
        console.log(`event started`)
        showUser()
        console.log(`event ended`)
    })

    ////////////////////////////

    const getUser = () => {
        console.log(`function started`)
        console.log(`function started`)
        return user
    }

    document.getElementById(`get-user`).addEventListener(`click`, () => {
        console.log(`event started`)
        console.log(`function started`)
        console.log(user)
        console.log(`event ended`)
    })

})()