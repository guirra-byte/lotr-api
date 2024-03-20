import * as HttpServer from 'node:http'
import axios from 'axios'
import { Worker } from 'node:worker_threads'
import { chaptersRsrc, database, databaseRsrc, characterRsrc } from '../path.config.mjs'
import fs from 'node:fs'

const LOTR_PORT = 1508
const LOTR_API_ACCESS_TOKEN = 'tiRBI-j2KzwyBwkNfVGX'

HttpServer.createServer(async (request, response) => {
  const lotrBaseURL = 'https://the-one-api.dev/v2'
  const [booksRsrc] = [lotrBaseURL.concat('/books')]

  if (request.url === '/books') {
    const { register_rsrc } = request.headers

    const noted = fs.existsSync(`${database}/books.json`)
    if (!noted) {
      try {
        const callApi = await axios.get(booksRsrc)
        if (callApi.status === 200) {
          if (register_rsrc) {
            const dbResourceWorker = new Worker(databaseRsrc)
            const bufferData = JSON.stringify(
              { dbResourceName: 'books', data: callApi.data.docs })
            dbResourceWorker.postMessage(bufferData)
          }
          response.end()
        }
      } catch (error) {
        throw error
      }
    }
  } if (request.url === '/books/chapter') {
    const chapterRsrc = new Worker(chaptersRsrc)
    chapterRsrc.on('message', (chapters) => {
      response.write(chapters)
    }); chapterRsrc.once('exit',
      () => { response.end() })

    const { book_id } = request.headers
    fs.readFile(`${database}/books.json`, (err, data) => {
      if (err) throw err;

      const parseData = JSON.parse(data.toString())
      for (let rsrc of parseData) {
        if (rsrc._id === book_id) {
          chapterRsrc.postMessage(book_id)
        }
      }
    })
  }

  if (request.url === '/character') {
    const noted = fs.existsSync(`${database}/characters.json`)
    const charactersRsrc = new Worker(characterRsrc)
    charactersRsrc.once('exit', () => {
      response.end()
    })

    if (!noted) {
      charactersRsrc.postMessage(LOTR_API_ACCESS_TOKEN)
    }
  }
})
  .listen(LOTR_PORT,
    () => console.log(`The server is running on ${LOTR_PORT}`))