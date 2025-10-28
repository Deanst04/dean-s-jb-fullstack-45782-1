import { NextFunction, Request, Response } from "express";
import Audience from "../../models/Audience";
import Game from "../../models/Game";
import { Op } from 'sequelize'
import { gamesByAudienceIdValidator } from "./validator";

export async function getAllGamesByAudience(req: Request<{ audienceId: string }>, res: Response, next: NextFunction) {
    try {
        const { games } = await Audience.findByPk(req.params.audienceId, {
            include: [Game]
        })
        res.json(games)
    } catch (e) {
        next(e)
    }
}

export async function filterByMaxPrice(req: Request, res: Response, next: NextFunction) {
    try {
        const games = await Game.findAll({ 
            where: {
                price: {
                    [Op.lte]: req.query.maxPrice
                }
            },
            include: [Audience]
        })
        res.json(games)
    } catch (e) {
        next(e)
    }
}

export async function createNewGame(req: Request, res: Response, next: NextFunction) {
    try {
        const newGame = await Game.create(req.body)
        await newGame.reload({ include: Audience })
        res.json(newGame)
    } catch (e) {
        next(e)
    }
}

export async function deleteGame(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const deletedRows = await Game.destroy({ where: { id } })
        if (deletedRows === 0) return next({
            status: 404,
            message: 'yo bro, da racord u wana dalete as not yar'
        })
        res.json({ message: "success" })
    } catch (e) {
        next(e)
    }
}