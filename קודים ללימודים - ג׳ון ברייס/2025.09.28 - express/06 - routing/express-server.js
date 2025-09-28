const express = require('express')
const { toXML } = require('jstoxml')

const PORT = process.env.PORT || 3000

const app = express()
const logRequest = require('./middlewares/log-request')
const errorLogger = require('./middlewares/error/logger')
const pagerDuty = require('./middlewares/error/pager-duty')
const errorResponder = require('./middlewares/error/responder')
const notFound = require('./middlewares/not-found')
const usersRouter = require('./routers/users')
const productsRouter = require('./routers/products')

app.use('/', logRequest)

app.use('/users', usersRouter)

app.use('/products', productsRouter)

// not found 404 middleware
app.use(notFound)

// error middlewares
app.use(errorLogger)
app.use(pagerDuty)
app.use(errorResponder)

app.listen(PORT, () => console.log(`server started on port ${PORT}...`))