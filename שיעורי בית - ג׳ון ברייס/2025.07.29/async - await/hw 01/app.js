"use strict";

(async () => {

    const getData = url => fetch(url).then(res => res.json())
    
    const fetchUsers = async () => {
        const users = await getData(`https://jsonplaceholder.typicode.com/users`)
        return users
    }

    const generateUserHTML = users => {
        const html = users
            .map(({ name, username, email, phone ,address : { street, city, zipcode }, company}) => 
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
            )
        .join(``)
        return html
    }

    const renderHTML = html => {
        document.getElementById("users-table").innerHTML = html
    }
    try {
        const users = await fetchUsers()
        const html = generateUserHTML(users)
        renderHTML(html)
    } catch (err) {
        console.log(err)
    }
    
})()