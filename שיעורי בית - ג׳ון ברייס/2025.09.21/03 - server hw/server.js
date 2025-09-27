const { createServer } = require('http')

const PORT = process.env.PORT || 3000

const users = [
    {
        id: 1,
        name: 'Bob',
    },
    {
        id: 2,
        name: 'Alice',
    },
    {
        id: 3,
        name: 'Diana',
    }
]

const products = [
    {
        id: 1,
        name: 'Iphone',
    },
    {
        id: 2,
        name: 'Macbook',
    },
    {
        id: 3,
        name: 'Ipad',
    },
]

const requestHandler = (request, response) => {
    console.log(`url is ${request.url} and method is ${request.method}`)

    switch (request.url) {
        case '/':
            switch (request.method) {
                case 'GET':
                    response.end('hello world')
                    break;
                default:
                    response.writeHead(404).end('not found')
            }
            break;
        case '/users':
            switch (request.method) {
                case 'GET':
                    response.setHeader('Content-Type', 'application/json')
                    response.end(JSON.stringify(users))
                    break;
                case 'POST':
                    console.log('saving user...')
                    response.end('user saved')
                    break;
                default:
                    response.writeHead(404).end('not found')
            }
            break;
        case '/products':
            switch(request.method) {
                case 'GET':
                    response.setHeader('Content-Type', 'application/xml')
                    const xml = `
                        <products>
                            ${products.map(p => `<product><id>${p.id}</id><name>${p.name}</name></product>`).join('')}
                        </products>
                    `
                    response.end(xml)
                    break;
                case 'POST':
                    console.log('saving product...')
                    response.end('product saved')
                    break;
                default:
                    response.writeHead(404).end('not found')
            }
        break;
    }
}


createServer(requestHandler).listen(PORT, () => console.log(`server started on port ${PORT}...`))