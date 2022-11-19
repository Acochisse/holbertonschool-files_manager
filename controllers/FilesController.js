const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

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
    if (parentID !== 0) {
      const parent = await dbClient.files.findOne({ _id: parentId });
      if (!parent) return response.status(400).json({ error: 'Parent not found' });
      if (parent.type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
    }
    const fileObj = {
      userId,
      name,
      type,
      isPublic,
      parentId,
    };

    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const localPath = path.join(folderPath, uuidv4());
      fs.writeFileSync;
      fileObj.localPath = localPath;
    }

    const result = await dbClient.files.insertOne(fileObj);
    return response.status(201).json(result.ops[0]);
  }
};
