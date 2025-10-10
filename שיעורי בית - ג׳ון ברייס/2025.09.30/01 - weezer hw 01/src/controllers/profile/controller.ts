import { NextFunction, Request, Response } from "express";
import Post from "../../models/Post";
import User from "../../models/User";
import Comment from "../../models/Comment";

export async function getProfile(req: Request, res: Response, next: NextFunction) {

    const userId = '1230ae30-dc4f-4752-bd84-092956f5c633'

    try {
        const { posts } = await User.findByPk(userId, {
            include: [{
                model: Post,
                include: [User, { 
                    model: Comment, 
                    include: [User]
                }]
            }]
        })
        res.json(posts)
    } catch (e) {
        next(e)
    }
}

export async function getPost(req: Request<{id: string}>, res: Response, next: NextFunction) {
    try {
        const post = await Post.findByPk(req.params.id, {
            include: [User, {
                model: Comment,
                include: [User]
            }]
        })
        res.json(post)
    } catch (e) {
        next(e)
    }
}

export async function deletePost(req: Request<{id: string}>, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const deletedRows = await Post.destroy({ where: { id } })
        if (deletedRows === 0) return next({
            status: 404,
            message: 'yo bro, da racord u wana dalete as not yar'
        })
        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {

    const userId = '1230ae30-dc4f-4752-bd84-092956f5c633'

    try {
        const { title, body } = req.body
        const newPost = await Post.create({ title, body, userId})
        res.status(201).json({
            message: 'New post added successfully',
            post: newPost
        })
    } catch (e) {
        next(e)
    }
}

export async function updatePost(req: Request<{id: string}>, res: Response, next: NextFunction) {

    const postId = req.params.id

    try {
        const [updatedRows] = await Post.update(req.body, { where: { id: postId} })
        if (updatedRows === 0) return next({
            status: 404,
            message: 'yo bro, da racord u wana updat as not yar'
        })
        const updatedPost = await Post.findByPk(postId)
        res.json({ 
            message: 'Post updated successfully',
            post: updatedPost
         })
    } catch (e) {
        next(e)
    }
}