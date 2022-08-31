import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

import Mongo from './db';

dotenv.config();

const app: Express = express();
const { PORT, MONGO_URL, DB_NAME } = process.env;

const mongo: Mongo = new Mongo();
mongo.connect(MONGO_URL, DB_NAME);

app.get('/api/tickers', async (req: Request, res: Response) => {
  try {
    const Tickers = await mongo.getCollection('tickers');
    Tickers.countDocuments();
    res.send(await Tickers.find({}).toArray());
  } catch(error) {
    console.error(error);
    res.sendStatus(500)
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});