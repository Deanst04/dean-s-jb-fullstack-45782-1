const express = require('express')
const { toXML } = require('jstoxml')

const products = [
    {
        id: 1,
        name: 'Mike'
    },
    {
        id: 2,
        name: 'Adidos'
    },
    {
        id: 3,
        name: 'Buma'
    }
]

const connectMongo = (request, response, next) => {
    console.log('connecting mongo')
    next()
}

const disconnectMongo = (request, response, next) => {
    console.log('disconnecting from mongo')
}

const getProducts = (request, response, next) => {
    response.setHeader('Content-Type', 'application/xml')
    response.end(toXML(products))
    next()
}

// a middleware that ends the respond is something called controller
// usually there will not be next() invocation in controllers
const newProduct = (request, response, next) => {
    // console.log('saving product...')
    // response.writeHead(201).end('product saved')
    response.status(201).send('saving product in database')
    next()
}

const productsRouter = express.Router()

productsRouter.use('/', connectMongo)
productsRouter.get('/', getProducts)
productsRouter.post('/', newProduct)
productsRouter.use('/', disconnectMongo)

module.exports = productsRouter