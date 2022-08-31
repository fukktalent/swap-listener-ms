import * as dotenv from 'dotenv';
import parseArgs from 'minimist';

import { listenQueue } from './mq';
import Mongo from './db';

dotenv.config();

const { MONGO_URL, DB_NAME, AMQP_URL } = process.env;

const args = parseArgs(process.argv.slice(2));
if (!args.queue) {
  console.log('Queue name is needed');
  process.exit(1);
}

const mongo: Mongo = new Mongo();

async function processMessage(message: { content: Buffer }) {
  try {
    const { ticker, swapsAmount } = JSON.parse(message.content.toString());
    const Tickers = await mongo.getCollection('tickers');
    await Tickers.updateOne({ ticker }, { $inc: { swaps: swapsAmount } }, { upsert: true });
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  await mongo.connect(MONGO_URL, DB_NAME);
  listenQueue(
    AMQP_URL,
    args.queue,
    processMessage,
  );
})();


