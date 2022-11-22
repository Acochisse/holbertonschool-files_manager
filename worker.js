/*
Create a file worker.js:

By using the module Bull, create a queue fileQueue
Process this queue:
If fileId is not present in the job, raise an error Missing fileId
If userId is not present in the job, raise an error Missing userId
If no document is found in DB based on the fileId and userId, raise an error File not found
By using the module image-thumbnail, generate 3 thumbnails with width = 500, 250 and 100 - store each result on the same location of the original file by appending _<width size>
Update the endpoint GET /files/:id/data to accept a query parameter size:

size can be 500, 250 or 100
Based on size, return the correct local file
If the local file doesn’t exist, return an error Not found with a status code 404
*/

const bull = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');
const mongo = require('mongodb');
const dbClient = require('../utils/db');

const fileQueue = new bull('fileQueue', 'redis');

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
  thumbnail._id = file._id + '_500';
  await files.insertOne(thumbnail);
  options.width = 250;
  const thumbnail2 = await imageThumbnail(localPath, options);
  thumbnail2._id = file._id + '_250';
  await files.insertOne(thumbnail2);
  options.width = 100;
  const thumbnail3 = await imageThumbnail(localPath, options);
  thumbnail3._id = file._id + '_100';
  await files.insertOne(thumbnail3);
});
