import { parentPort } from "node:worker_threads";
import axios from 'axios'

parentPort.on('messageerror', (error) => console.log(error))
parentPort.on('message', async (book_id) => {
  const reply = await axios.get(`https://the-one-api.dev/v2/book/${book_id}/chapter`,
    { headers: { Authorization: 'Bearer tiRBI-j2KzwyBwkNfVGX' } })
  parentPort.postMessage(JSON.stringify(reply.data))
})