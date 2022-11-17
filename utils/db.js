//const { promisify } = require('util');
const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017 ;;
const database =  process.env.DATABASE || "file_manager";
const url = `mongodb://${host}:${port}`;

class DbClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true}, (err, client) => {
      if (client) {
        this.db = client.db(database)
        this.users = client.database.collection('users')
        this.files = client.database.collection('files')
      }
      if (err) {
        console.log(err);
        this.db = false;
      }
    })
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
    const filecount = await this.files.countDocuments({});
    return filecount;
  }
}


const dbClient = new DbClient;
module.exports = dbClient;
