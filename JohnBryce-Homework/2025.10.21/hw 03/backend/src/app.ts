import express, { json } from 'express'
import logger from './middlewares/error/logger';
import responder from './middlewares/error/responder';
import notFound from './middlewares/not-found';
import categoriesRouter from './routers/categories'
import productsRouter from './routers/products'
import config from 'config'
import sequelize from './db/sequelize';
import cors from 'cors'

const app = express()

const port = config.get<number>('app.port')
const appName = config.get<string>('app.name')

app.use(cors())

// post decypher middleware
app.use(json())

// load routers
app.use('/categories', categoriesRouter)
app.use('/products', productsRouter)

// not found
app.use(notFound)

// error middlewares
app.use(logger)
app.use(responder)

// synchronize database schema (not data) changes to the database
// i.e syncs our TypeScript models folder into the actual SQL schema
sequelize.sync({ force: process.argv[2] === 'sync' ? true : false })

console.log(process.argv[2])

app.listen(port, () => console.log(`${appName} started on port ${port}`))