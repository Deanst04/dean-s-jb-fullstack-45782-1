import { randomUUID } from "crypto"
import { hashAndSaltPassword } from "./controller"

describe('unit testing for all auth controller functions', () => {
    describe('unit testing for hashAndSaltPassword', () => {
        test('generates sha256 compatible output', () => {
            const result = hashAndSaltPassword(randomUUID())
            // check that it is not undefined
            expect(result).toBeDefined()
            // check that it is 64 chars long
            expect(result).toHaveLength(64)
            // check that all chars are hexa
            expect(result).toMatch(/^[a-f0-9A-F]+$/)
        })
        test('same plain text generates same hash', () => {
            const plainTextPassword = randomUUID()
            const result1 = hashAndSaltPassword(plainTextPassword)
            const result2 = hashAndSaltPassword(plainTextPassword)
            expect(result1).toEqual(result2)
        })
        test('different plain text generates different hash', () => {
            const plainTextPassword1 = randomUUID()
            const plainTextPassword2 = randomUUID()
            expect(plainTextPassword1).not.toEqual(plainTextPassword2)
            const result1 = hashAndSaltPassword(plainTextPassword1)
            const result2 = hashAndSaltPassword(plainTextPassword2)
            expect(result1).not.toEqual(result2)
        })
    })
})