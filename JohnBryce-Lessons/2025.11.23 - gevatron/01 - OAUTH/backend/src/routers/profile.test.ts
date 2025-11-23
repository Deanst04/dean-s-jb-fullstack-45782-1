import request from 'supertest'
import app, { start } from '../app'
import { sign } from 'jsonwebtoken'
import config from 'config'

describe('profile routers tests', () => {
    describe('GET / tests', () => {
        test('returns 401 if no auth header', async () => {
            await start()
            const result = await request(app).get('/profile')
            expect(result.statusCode).toBe(401)
        })
        test('it should return an array of posts', async () => {
            const jwt = sign(({ id: '1230ae30-dc4f-4752-bd84-092956f5c633' }), config.get<string>('app.jwtSecret'))
            // sign up as a new user (Malcolm)
            // add some posts as new user
            await start()
            const result = await request(app)
                .get('/profile')
                .set({
                    authorization: `Bearer ${jwt}`
                })
            expect(result.statusCode).toBe(200)
            expect(Array.isArray(result.body)).toBeTruthy()
            expect(result.body[0]).toHaveProperty('id')
            expect(result.body[0].id).toBe('02e43575-d446-4455-a338-a1e3abc71383')
        })
    })
})