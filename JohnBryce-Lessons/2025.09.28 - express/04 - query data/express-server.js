const express = require('express')
const { toXML } = require('jstoxml')

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

// a middleware in express is a function with the following signature: (request, response, next): void
const logRequest = (request, response, next) => {
    console.log('logging request...')
    next() // this is how i let express know that i have finished running
    // and it could forward the wand to the next middleware
}

const connectMysql = (request, response, next) => {
    const db = { version: 'mySQL 5.1'}
    request.db = db
    console.log('connecting mysql')
    next() // calling next without any param. signifies success
    // next('error') // calling next with a param , means there was error
}

const disconnectMysql = (request, response, next) => {
    console.log('disconnecting from mysql')
}

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

const getUsers = (request, response, next) => {
    // response.setHeader('Content-Type', 'application/json')
    // response.end(JSON.stringify(users))
    console.log(`age is ${request.query.age}`)
    console.log(`db connection is`, request.db)
    response.json(users)
    next()
}

const newUser = (request, response, next) => {
    console.log('saving user...')
    // response.writeHead(201).end('user saved')
    response.status(201).send('saving user in database')
    console.log('responded...')
    next()
}

const notFound = (request, response, next) => {
    response.status(404).send('yo bro, what u want is not here... with accent')
}

const errorLogger = (err, request, response, next) => {
    console.error(err)
    next(err)
}

const pagerDuty = (err, request, response, next) => {
    console.log('sending page to Ido')
    next(err)
}

const errorResponder = (err, request, response, next) => {
    response.status(err.status || 500).send(err || 'internal server error...')
}

// a middleware that ends the respond is something called controller
// usually there will not be next() invocation in controllers
const newProduct = (request, response, next) => {
    // console.log('saving product...')
    // response.writeHead(201).end('product saved')
    response.status(201).send('saving product in database')
    next()
}

const app = express()

app.use('/', logRequest)
app.use('/users', connectMysql)
app.get('/users', getUsers)
app.post('/users', newUser)
app.use('/users', disconnectMysql)
app.use('/products', connectMongo)
app.get('/products', getProducts)
app.post('/products', newProduct)
app.use('/products', disconnectMongo)

// not found 404 middleware
app.use(notFound)

// error middlewares
app.use(errorLogger)
app.use(pagerDuty)
app.use(errorResponder)

app.listen(PORT, () => console.log(`server started on port ${PORT}...`))