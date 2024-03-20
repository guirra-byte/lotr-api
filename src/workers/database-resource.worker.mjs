import { parentPort } from "node:worker_threads";
import fs from 'node:fs';
import { database } from "../../path.config.mjs";

parentPort.on('message', (rsrc) => {
  const { dbResourceName, data } = JSON.parse(rsrc)
  fs.writeFile(`${database}/${dbResourceName}.json`,
    JSON.stringify(data), (err) => {
      if (err) throw err;
    })
})