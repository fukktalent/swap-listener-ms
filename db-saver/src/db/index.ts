import { MongoClient, Db, Collection } from 'mongodb';

export default class Mongo {
  private db: Db;
  private client: MongoClient;

  async connect(url: string, dbName: string) {
    this.client = new MongoClient(url);
    await this.client.connect();
    this.db = this.client.db(dbName);
  }

  async getCollection(name: string): Promise<Collection> {
    return this.db.collection(name);
  }
}
