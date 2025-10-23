import { Sequelize } from "sequelize-typescript";
import config from 'config'
import Category from "../models/category";
import Product from "../models/product";

const sequelize = new Sequelize({
    ...config.get('db'), 
    dialect: 'mysql',
    models: [Category, Product],
    logging: console.log
})

export default sequelize
