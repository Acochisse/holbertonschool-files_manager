//const { promisify } = require('util');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017 ;;
const database =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}`;

class DbClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.db = client.db(database)
    this.users = client.database.collection('users')
    this.files = client.database.collection('files')
    this.client.connect();
  }


  isAlive() {
    if (!this.db){
      return (!!this.db)
    }
    return(!!this.db)
  }

  async nbUsers() {
    const usercount = await this.users.countDocuments({});
    return usercount;
  }

  async nbFiles() {
    const filecount = await this.db.files.countDocuments({});
    return filecount;
  }
}


const dbClient = new DbClient;
module.exports = dbClient;
