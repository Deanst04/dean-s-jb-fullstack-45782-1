import Kitten from "./kitten.js";
import Backup from "./backup.js";

const backup1 = new Backup<string>(`my full name`, `Dean Stark`)
const backup2 = new Backup<number>(`my age`, 21)
const backup3 = new Backup<boolean>(`am i a man?`, true)
const backup4 = new Backup<Date>(`my birthday date`, new Date(2004, 6, 23))
const backup5 = new Backup<Kitten>(`my lovely kitten`, new Kitten(`lichi`, `grey and white`, 1))

console.log(backup1)
console.log(`<------->`)
console.log(backup2)
console.log(`<------->`)
console.log(backup3)
console.log(`<------->`)
console.log(backup4)
console.log(`<------->`)
console.log(backup5)