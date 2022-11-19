import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

module.exports = new class AuthController {
  async getConnect(request, response) {
    if (!request.headers.authorization || request.headers.authorization.indexOf('Basic ') === -1) {
      return response.status(401).json({ message: 'Missing Auth Header'});
    }
    const rawCred = request.headers.authorization;
    const slice = rawCred.slice(6);
    const stringCred = Buffer.from(slice, 'base64').toString();
    const [email, pwd] = stringCred.split(':');

    if (!email || !pwd){
      return response.status(401).json({error: 'Unauthorized'});
    }
    const cred = {email, password: sha1(pwd)};
    const user = await dbClient.db.collection('users').findOne(cred);

    if (!user){
      return response.status(401).json({error: 'Unauthorized'});
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 86400);
    return response.status(200).json({ token });
  }

  async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    
    await redisClient.del(`auth_${token}`);
    response.status(204).end();
    return null;
  }
};
