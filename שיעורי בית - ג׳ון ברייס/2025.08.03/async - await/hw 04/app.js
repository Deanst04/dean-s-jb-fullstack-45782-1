"use strict";

(async () => {

    const getData = url => fetch(url).then(result => result.json())

    const fetchRecipes = async () => {
        const { recipes } = await getData(`https://dummyjson.com/recipes`)
        return recipes
    }

    const generateRecipesHTML = recipes => {
        const html = recipes.map(({name, image}) => 
            `
            <tr>
                <td class="text-center align-middle">${name}</td>
                <td class="text-center align-middle"><img src="${image}"></td>
            </tr>
        `).join(``)
        return html
    }

    const renderRecipesHTML = html => {
        document.getElementById("recipes-table").innerHTML = html
    }


    document.getElementById("get-recipes").addEventListener(`click`, async () => {

        try {
            const recipes = await fetchRecipes()
            const html = generateRecipesHTML(recipes)
            renderRecipesHTML(html)
            console.log(`done!`)
        } catch (err) {
            console.log(err)
        }
    })
            

})()