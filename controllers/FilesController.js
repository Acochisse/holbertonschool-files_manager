const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

module.exports = new class FilesController {
  async postFile(request, response) {
    const token = request.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);

    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId = 0, isPublic = false, data,
    } = request.body;
    if (!name) return response.status(400).json({ error: 'Missing name' });
    if (!type) return response.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return response.status(400).json({ error: 'Missing data' });
    if (parentId !== 0) {
      const dbParentID = new mongo.ObjectId(parentId);
      const parent = await dbClient.files.findOne({ _id: dbParentID });
      if (!parent) return response.status(400).json({ error: 'Parent not found' });
      if (parent.type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
    }
    const USERID = new mongo.ObjectId(user);

    // if type is folder
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
        parentId,
      });
    }
    //
    // if type is not folder create folder to store item in.
    const FOLDER_PATH = process.env.FOLDER_PATH || ('/tmp/files_manager');

    if (!fs.existsSync(FOLDER_PATH)) {
      fs.mkdirSync(FOLDER_PATH);
    }
    const localPath = (`${FOLDER_PATH}/${uuidv4()}`);
    // do we need to build a parent path if there is a parent?
    const decodedData = Buffer.from(data, 'base64');
    await fs.promises.writeFile(localPath, decodedData.toString(), { flag: 'w+' });
    const OutFileObj = {
      userId: USERID,
      name,
      type,
      isPublic,
      parentId,
      localPath: path.resolve(localPath),
    };

    const afterInsert = await dbClient.files.insertOne(OutFileObj);
    return response.status(201).json(
      {
        id: afterInsert.insertedId,
        userId: USERID,
        name,
        type,
        isPublic,
        parentId,
      },
    );
  }

  async getShow(req, res) {
    // auth
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // Getting the ID and returning it
    const { id } = req.params;
    const dbID = new mongo.ObjectId(id);
    const file = await dbClient.files.findOne({ _id: dbID });
    if (!file) return res.status(404).json({ error: 'Not found' });
    if (user !== file.userId.toString()) return res.status(404).send({ error: 'Not found' });
    return res.status(200).json(file);
  }

  async getIndex(req, res) {
    // auth
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // pagination
    // GET /files with no parentId and no page, response 200 with page
    // Get /files with parentId and no page, response 200 with page
    // Get /files with no parentId and page, response 200 with page
    const { parentId = 0, page = 0 } = req.query;
    const USERID = new mongo.ObjectId(user);
    const dbParentID = new mongo.ObjectId(parentId);
    const parent = await dbClient.files.findOne({ _id: dbParentID });
    // if gate if parent !== 0
    const files = await dbClient.files.aggregate([
      { $match: { parentId: parentID } },
      { $skip: page * 20 },
      { $limit: 20 },
    ]).toArray();
      // if (parentId !== 0 && !parent) return res.status(200).json([])

    return res.status(200).json(files);
  }

  async putPublish(req, res) {
    // auth
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const dbID = new mongo.ObjectId(id);
    const file = await dbClient.files.findOne({ _id: dbID });
    if (!file) return res.status(404).json({ error: 'Not found' });
    if (user !== file.userId.toString()) return res.status(404).send({ error: 'Not found' });
    if (file.isPublic === true) return res.status(200).json(file);
    let updateFile = await dbClient.files.updateOne({ _id: dbID }, { $set: { isPublic: true } });
    updateFile = await dbClient.files.findOne({ _id: dbID });
    return res.status(200).json(updateFile);
  }

  async putUnpublish(req, res) {
    // auth
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const dbID = new mongo.ObjectId(id);
    const file = await dbClient.files.findOne({ _id: dbID });
    // if dbID.isPublic === false return
    if (!file) return res.status(404).json({ error: 'Not found' });
    if (user !== file.userId.toString()) return res.status(404).send({ error: 'Not found' });
    if (file.isPublic === false) return res.status(200).json(file);
    let updateFile = await dbClient.files.updateOne({ _id: dbID }, { $set: { isPublic: false } });
    updateFile = await dbClient.files.findOne({ _id: dbID });
    return res.status(200).json(updateFile);
  }

  async getFile(req, res) {
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);

    const Id = new mongo.ObjectId(req.params.id);
    const file = await dbClient.files.findOne({ _id: Id });
    if (!file) return res.status(404).json({ error: 'Not found' });
    if (!file.isPublic && (!user || user !== file.userId.toString())) return res.status(404).send({ error: 'Not found' });
    if (file.type === 'folder') return res.status(400).send({ error: "A folder doesn't have content" });
    if (!fs.existsSync(file.localPath)) return res.status(404).send({ error: 'Not found' });

    const data = fs.readFileSync(file.localPath);
    return res.status(200).send(data);
  }
}();
