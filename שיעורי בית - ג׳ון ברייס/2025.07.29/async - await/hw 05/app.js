"use strict";

(async () => {
    const getData = url => fetch(url).then(result => result.json())

    document.getElementById("get-user").addEventListener(`click`, async () => {

        const fetchUser = async () => {
            const { users } = await getData(`https://dummyjson.com/users`)
            return users
        }

        const generateUserData = user => {
            const html = user.map(({ firstName, lastName, email, image}) => 
                `
                <tr>
                    <td class="text-center align-middle">${firstName}</td>
                    <td class="text-center align-middle">${lastName}</td>
                    <td class="text-center align-middle">${email}</td>
                    <td class="text-center align-middle"><img src="${image}"></td>
                </tr>
                `
            ).join(``)
            return html
        }

        try {
            const users = await fetchUser()
            const html = generateUserData(users)
            document.getElementById("user-table").innerHTML = html
            console.log(`success`)
        } catch (err) {
            console.log(`error: ${err}`)
        }
    })

})()