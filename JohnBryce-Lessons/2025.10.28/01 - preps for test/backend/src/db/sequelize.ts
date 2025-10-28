import { Sequelize } from "sequelize-typescript";
import config from 'config'
import Game from "../models/Game";
import Audience from "../models/Audience";

const sequelize = new Sequelize({
    ...config.get('db'), 
    dialect: 'mysql',
    models: [Game, Audience],
    logging: console.log
})

export default sequelize
