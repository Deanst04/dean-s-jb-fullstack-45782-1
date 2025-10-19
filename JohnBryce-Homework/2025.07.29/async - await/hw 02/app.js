"use strict";

(async () => {

    document.getElementById("get-user").addEventListener(`click`, async () => {
    
    const userID = +document.getElementById("user-id").value

    if (userID > 10 || userID < 1) {
        alert("number must be between 1 - 10, please try again")
        return
    };
    
    const getData = url => fetch(url).then(res => res.json())
    
    const fetchUsers = async () => {
        const user = await getData(`https://jsonplaceholder.typicode.com/users/${userID}`)
        return user
    }

    const generateUserHTML = user => {
        const { name, username, email, phone ,address : { street, city, zipcode }, company} = user
        const html = 
                `<tr>
                    <td class="text-center">${name}</td>
                    <td class="text-center">${username}</td>
                    <td class="text-center">${email}</td>
                    <td class="text-center">${phone}</td>
                    <td class="text-center">${city}</td>
                    <td class="text-center">${street}</td>
                    <td class="text-center">${zipcode}</td>
                    <td class="text-center">${company.name}</td>
                </tr>`
        return html
    }

    const renderHTML = html => {
        document.getElementById("users-table").innerHTML = html
    }
    try {
        const user = await fetchUsers()
        const html = generateUserHTML(user)
        renderHTML(html)
    } catch (err) {
        console.log(err)
    }
    })
    
})()