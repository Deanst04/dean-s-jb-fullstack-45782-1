import { NextFunction, Request, Response } from "express";

export async function signup(req: Request<{postId: string}>, res: Response, next: NextFunction) {
    try {

    } catch (e) {
        next(e)
    }
}

export async function login(req: Request<{postId: string}>, res: Response, next: NextFunction) {
    try {

    } catch (e) {
        next(e)
    }
}