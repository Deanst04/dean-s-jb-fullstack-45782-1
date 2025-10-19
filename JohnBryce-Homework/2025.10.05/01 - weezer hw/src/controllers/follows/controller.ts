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

export async function follow(req: Request<{followeeId: string}>, res: Response, next: NextFunction) {
    try {
        
        const { followeeId } = req.params

        const newFollow = await Follow.create({
            followerId: userId,
            followeeId
        })
        
        res.status(201).json({
            message: 'Follower added successfully'
        })

    } catch (e) {
        next(e)
    }
}

export async function unfollow(req: Request<{followeeId: string}>, res: Response, next: NextFunction) {
    try {

        const { followeeId } = req.params

        await Follow.destroy({
            where: {
                followerId: userId,
                followeeId
            }
        })

        res.status(200).json({message: 'Unfollowed successfully'})

    } catch (e) {
        next(e)
    }
}