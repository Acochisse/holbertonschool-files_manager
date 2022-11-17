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
    try {
      const db = this.client.db(database);
      const users = db.collection('users');
      const countPromise = promisify(users.countDocuments).bind(users);
      return countPromise();
    }
    catch (err) {
      console.log(err);
    }
  }

  async nbFiles() {
    try {
      const db = this.client.db(database);
      const files = db.collection('files');
      const countPromise = promisify(files.countDocuments).bind(files);
      return countPromise();
    }
    catch (err) {
      console.log(err);
    }
  }
}


const dbClient = new DbClient;
module.exports = dbClient;
