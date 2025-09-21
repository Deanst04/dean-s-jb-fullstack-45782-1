(async () => {
    const getData = url => fetch(url).then(res => res.json())
    const { users } = await getData(`https://dummyjson.com/users`)
    console.log(users.map(({firstName, lastName}) => `${firstName}  ${lastName} \n`).join(``))
})()