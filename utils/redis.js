//script that creates the class RedisClient
//RedisClient should have:
// the constructor that creates a client to Redis:
// any error of the redis client must be displayed in the console (you should use on('error') of the redis client)
// a function isAlive that returns true when the connection to Redis is a success otherwise, false
// an asynchronous function get that takes a string key as argument and returns the Redis value stored for this key
// an asynchronous function set that takes a string key, a value and a duration in second as arguments to store it in Redis (with an expiration set by the duration argument)
// an asynchronous function del that takes a string key as argument and remove the value in Redis for this key



const redis = require('redis');
const client = redis.createClient();

client.on('error', function (err) {
    console.log('Error ' + err);
});

class RedisClient {
    constructor() {
        this.client = redis.createClient();
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async set(key, value, duration) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value);
            this.client.expire(key, duration);
            resolve();
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key);
            resolve();
        });
    }
}

module.exports = new RedisClient();
