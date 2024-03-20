import path from 'node:path'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).concat('/src')

const lotrWorker = join(__dirname, '/workers/lotr.worker.mjs')

const booksRsrc = join(__dirname, '/workers/lotr-books-name.worker.mjs')
const databaseRsrc = join(__dirname, '/workers/database-resource.worker.mjs')
const chaptersRsrc = join(__dirname, '/workers/chapters.worker.mjs')
const characterRsrc = join(__dirname, '/workers/characters.worker.mjs')
const database = join(__dirname, '/database')

export { lotrWorker, booksRsrc, databaseRsrc, chaptersRsrc, characterRsrc, database }