export default function generatePassword(length: number, useSpecialChars: boolean = false): string {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    const specialChars = '!@#$%^&*()'
    const allChars = possibleCharacters + specialChars

    let password = ''

    for(let i = 0; i < length; i++) {

        const charsToUse = useSpecialChars ? allChars : possibleCharacters

        password += charsToUse[Math.floor(Math.random() * (charsToUse.length))]
    }

    return password
}