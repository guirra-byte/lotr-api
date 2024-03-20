import { parentPort, Worker } from "node:worker_threads";
import axios from 'axios'
import { databaseRsrc } from "../../path.config.mjs";

parentPort.on('messageerror', (error) => { throw error })
parentPort.on('message', async (token) => {
  try {
    const callApi = await axios.get('https://the-one-api.dev/v2/character',
      { headers: { Authorization: `Bearer ${token}` } })
    let reply = callApi.data.docs

    function* note() {
      let groupedItems = []
      for (let index = 0; index < reply.length; index++) {
        if (index % 100 === 0) {
          yield groupedItems
          groupedItems = []
        } else {
          groupedItems.push(reply[index])
        }
      }
    }

    for (const data of note()) {
      const dbRsrc = new Worker(databaseRsrc)
      dbRsrc.postMessage(JSON.stringify
        ({ dbResourceName: 'characters', data }))
    }
  }
  catch (err) { throw err }
})