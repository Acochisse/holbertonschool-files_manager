const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');

module.exports = new class FilesController {
  async postFile(request, response) {
    const token = request.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);

    if (!user) {
      return response.status(401).json({error: 'Unauthorized'});
    }

    const { name, type, parentId = 0, isPublic = false, data } = request.body;
    if (!name) return response.status(400).json({ error: 'Missing name' });
    if (!type) return response.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return response.status(400).json({ error: 'Missing data' });
    if (parentId !== 0) {
      const parent = await dbClient.files.findOne({ _id: parentId });
      if (!parent) return response.status(400).json({ error: 'Parent not found' });
      if (type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
    }
    
    const fileObj = {
      userId: new mongo.ObjectID(user),
      name,
      type,
      isPublic,
      parentId, 
    };

    if (type === 'folder') {
      const insertFile = await dbClient.files.insertOne(fileObj);
      return response.status(201).json(fileObj);
    } else {
      const FOLDER_PATH = process.env.FOLDER_PATH || ('/tmp/files_manager');
      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH);
      }
      const LocalPath = (`${FOLDER_PATH}/${uuidv4()}`);
      const decodedData = Buffer.from(data, 'base64');
      await fs.promises.writeFile(LocalPath, decodedData);
      const OutFileObj = {
        userId: new mongo.ObjectID(user),
        name,
        type,
        isPublic,
        parentId,
        LocalPath: path.resolve(LocalPath),
      };
      await dbClient.files.insertOne(OutFileObj);
      return response.status(201).json(OutFileObj);
    }
  }
}
  