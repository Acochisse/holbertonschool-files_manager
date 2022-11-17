const { promisify } = require('promisify');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017 ;;
const DB_DATABASE =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}/${database}`;

class DbClient {
  constructor() {
    this.host = DB_HOST;
    this.port = DB_PORT;
    this.database = DB_DATABASE;
    this.client = new MongoClient(url);
  }

  isAlive() {
    console.log(this.client);
    return this.client.isConnected();
  }

  async nbUSers() {
    this.client.use(DB_DATABASE);
    const UserPromise = promisify(this.client.users.find()).bond(this.client);
    return UserPromise();
  }

  async nbFiles() {
    this.client.use(DB_DATABASE);
    const FilePromise = promisify(this.client.files.find()).bond(this.client);
    return FilePromise();
  }
}

const dbClient = new DbClient;
module.exports = dbClient;
