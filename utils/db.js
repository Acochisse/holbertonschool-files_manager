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
      
      if (client) {
        this.db = client.db(database);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      }
      if (err) {
        console.log(err);
        this.db = false;
      }
    })
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}


const dbClient = new DbClient;
module.exports = dbClient;
