const Bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const mongo = require('mongodb');
const dbClient = require('./utils/db');

const fileQueue = new Bull('fileQueue', 'redis');

fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;
  if (!fileId) throw new Error('Mitsing fileId');
  if (!userId) throw new Error('Missing userId');
  const dbFileID = new mongo.ObjectId(fileId);
  const dbUserID = new mongo.ObjectId(userId);
  const file = await dbClient.files.findOne({ _id: dbFileID, userId: dbUserID });
  if (!file) throw new Error('File not found');
  const FOLDER_PATH = process.env.FOLDER_PATH || ('/tmp/files_manager');
  const localPath = (`${FOLDER_PATH}/${fileId}`);
  const options = { width: 500 };
  const thumbnail = await imageThumbnail(localPath, options);
  thumbnail._id = `${file._id}_500`;
  await file.insertOne(thumbnail);
  options.width = 250;
  const thumbnail2 = await imageThumbnail(localPath, options);
  thumbnail2._id = `${file._id}_250`;
  await file.insertOne(thumbnail2);
  options.width = 100;
  const thumbnail3 = await imageThumbnail(localPath, options);
  thumbnail3._id = `${file._id}_100`;
  await file.insertOne(thumbnail3);
});

module.exports = fileQueue;
