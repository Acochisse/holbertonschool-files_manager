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
    const USERID = new mongo.ObjectId(user)
    
    //if type is folder 
    if (type === 'folder') {
      const fileObj = {
        userId: USERID,
        name,
        type,
        isPublic,
        parentId, 
      };
      const insertFile = await dbClient.files.insertOne(fileObj);
      return response.status(201).json({
        id: insertFile.insertedId,
        userId: USERID,
        name,
        type,
        isPublic,
        parentId
      });
    }
    //
    //if type is not folder create folder to store item in.
      const FOLDER_PATH = process.env.FOLDER_PATH || ('/tmp/files_manager');

    if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH);
      }
      const localPath = (`${FOLDER_PATH}/${uuidv4()}`);
      const decodedData = Buffer.from(data, 'base64');
      await fs.promises.writeFile(localPath, decodedData.toString(), {flag: 'w+'});
      const OutFileObj = {
        userId: USERID,
        name,
        type,
        isPublic,
        parentId: (parentId),
        localPath: path.resolve(localPath),
      };

      const afterInsert = await dbClient.files.insertOne(OutFileObj);
      return response.status(201).json(
        {
          id: afterInsert.insertedId,
          userId:  USERID,
          name,
          type,
          isPublic,
          parentId
        }
      );
      };
    }
