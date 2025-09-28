const express = require('express')

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

const usersRouter = express.Router()

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

const getUsers = (request, response, next) => {
    // response.setHeader('Content-Type', 'application/json')
    // response.end(JSON.stringify(users))
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

usersRouter.use('/', connectMysql)
usersRouter.get('/', getUsers)
usersRouter.post('/', newUser)
usersRouter.use('/', disconnectMysql)

module.exports = usersRouter