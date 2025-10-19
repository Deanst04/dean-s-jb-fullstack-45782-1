"use strict";

(async () => {

    const getData = url => fetch(url).then(result => result.json())


    document.getElementById("get-user").addEventListener(`click`, async () => {
        
        const fetchUsers = async () => {
            const { recipes } = await getData(`https://dummyjson.com/recipes`)
            return recipes
        }

        const generateRecipesData = recipes => {
            const html = recipes.map(({ name, image }) => `
            <tr>
            <td class="text-center align-middle">${name}</td>
            <td class="text-center align-middle"><img src="${image}"></td>
            </tr>
            `).join(``)
            return html
        }
        
        try {
            const recipes = await fetchUsers()
            const html = generateRecipesData(recipes)
            document.getElementById("recipes-table").innerHTML = html
            console.log(`success`)
        } catch (err) {
            console.log(`error: ${err}`)
        }
    })
})()