const database = require('./utils/db.js');
const redis = require('./utils/redis.js');
const app = require('./server.js');


database.dbClient.insertOne({name: 'test', email: 'soup@sandwich.com'}, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
    });
    
database.dbClient.nbUsers().then((result) => {
    console.log(result);
    }
    );
    