const { promisify } = require('util');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017 ;;
const database =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}`;

class DbClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
  }


  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const db = this.client.db(database);
    const users = db.collection('users');
    const countPromise = promisify(users.countDocuments).bind(users).catch((err) => {
      console.log(err);
    });;
    return countPromise();
  }

  async nbFiles() {
    const db = this.client.db(database);
    const files = db.collection('files');
    const countPromise = promisify(files.countDocuments).bind(files).catch((err) => {
      console.log(err);
    });;
    return countPromise();
  }
}

const dbClient = new DbClient;
module.exports = dbClient;
