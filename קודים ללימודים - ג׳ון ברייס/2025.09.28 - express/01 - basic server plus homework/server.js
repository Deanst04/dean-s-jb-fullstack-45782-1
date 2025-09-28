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
        title: 'Keyboard',
    },
    {
        id: 2,
        title: 'Mouse',
    },
    {
        id: 3,
        title: 'Monitor',
    }
]

const toProductsXml = (items) => {
    const productNodes = items
        .map((product) => `        <product><id>${product.id}</id><title>${product.title}</title></product>`)
        .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<products>\n${productNodes}\n</products>`
}

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
                    response.writeHead(201).end('user saved')
                    console.log('responded...')
                    break;
                default:
                    response.writeHead(404).end('not found')
            }
            break;
        case '/products':
            switch (request.method) {
                case 'GET':
                    response.setHeader('Content-Type', 'application/xml')
                    response.end(toProductsXml(products))
                    break;
                case 'POST':
                    console.log('saving product...')
                    response.writeHead(201).end('product saved')
                    break;
                default:
                    response.writeHead(404).end('not found')
            }
            break;
    }
}


createServer(requestHandler).listen(PORT, () => console.log(`server started on port ${PORT}...`))
