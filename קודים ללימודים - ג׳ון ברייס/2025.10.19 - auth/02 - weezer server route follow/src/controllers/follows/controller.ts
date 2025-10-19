import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import Follow from "../../models/Follow";

const userId = '1230ae30-dc4f-4752-bd84-092956f5c633'

export async function getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
        const { following } = await User.findByPk(userId, {
            include: [{
                model: User,
                as: 'following'
            }]
        })

        res.json(following)

    } catch (e) {
        next(e)
    }
}

export async function getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
        const { followers } = await User.findByPk(userId, {
            include: [{
                model: User,
                as: 'followers'
            }]
        })

        res.json(followers)

    } catch (e) {
        next(e)
    }
}

export async function follow(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const follow = await Follow.create({
            followerId: userId,
            followeeId: req.params.id
        })
        res.json(follow)
    } catch (e) {
        next(e)
    }
}

export async function unfollow(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const follow = await Follow.findOne({
            where: {
                followerId: userId,
                followeeId: req.params.id
            }
        })
        if(!follow) throw new Error('followee not found')
        await follow.destroy()
        res.json({
            success: true
        })
    } catch (e) {
        if(e.message === 'followee not found') {
            next({
                status: 422,
                message: 'followee not found'
            })
        }
        next(e)
    }
}