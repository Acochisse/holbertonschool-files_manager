//const { promisify } = require('util');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017 ;
const database =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}`;

class DbClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true}, (err, client) => {
      if (err) {
        console.log(err);
        this.db = false;
      }
      else {
        this.db = client.db(database);
        this.users = client.db.collection('users');
        this.files = client.db.collection('files');
      }
    })
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbFiles() {
    return this.files.countDocuments();
  }
}


const dbClient = new DbClient;
module.exports = dbClient;
