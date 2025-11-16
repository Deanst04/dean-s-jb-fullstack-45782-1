import { Upload } from "@aws-sdk/lib-storage";
import { NextFunction, Request, Response } from "express";
import s3Client from "../aws/aws";
import config from 'config'
import { UploadedFile } from "express-fileupload";
import { randomUUID } from "crypto";
import { extname } from "path";
import { URL } from 'url'

declare global {
    namespace Express {
        interface Request {
            imageUrl: string
        }
    }
}

export default async function fileUploader(req: Request, res: Response, next: NextFunction) {
    if (!req.files) next()
    if (!req.files.image) next()

    console.log(req.files)    

    const { mimetype , data, name} = req.files.image as UploadedFile

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: config.get<string>('s3.bucket'),
            Key: `${randomUUID()}${extname(name)}`,
            ContentType: mimetype,
            Body: data
        }
    })

    // smaller the pic to 400px

    // save it in s3 with _400 suffix
    // original pic: 123456.jpg
    // save as: 123456_400.jpg

    const result = await upload.done()
    const url = new URL(result.Location)
    req.imageUrl = url.pathname
    next()
}