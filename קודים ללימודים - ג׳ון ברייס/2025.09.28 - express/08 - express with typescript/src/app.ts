import express, { type Request, type Response, type NextFunction } from 'express';

const app = express()

function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`logging request very very very good`)
  next();
}

app.use('/', logRequest)

app.listen(3000, () => {})
