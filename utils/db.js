const { promisify } = require('util');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017 ;;
const database =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}/${database}`;

class DbClient {
  constructor() {
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        console.log(err);
      }
    });
    
  }


  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    this.client.use(database);
    const UserPromise = promisify(this.client.users.find()).bind(this.client);
    return UserPromise();
  }

  async nbFiles() {
    this.client.use(database);
    const FilePromise = promisify(this.client.files.find()).bind(this.client);
    return FilePromise();
  }
}

const dbClient = new DbClient;
module.exports = dbClient;
