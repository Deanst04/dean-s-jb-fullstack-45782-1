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
    })
})