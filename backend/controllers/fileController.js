const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const mkdirp = require('mkdirp');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  httpOptions: {
    timeout: 120000 // 2 minutes timeout
  }
});

const uploadToS3 = (filePath, bucketName, key) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const listFilesInS3Directory = (bucketName, prefix) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Prefix: prefix
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const fileNames = data.Contents.map(item => item.Key);
        resolve(fileNames);
      }
    });
  });
};

const downloadFromS3 = (bucketName, key, downloadPath) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    const dirname = path.dirname(downloadPath);
    try {
      fs.mkdirSync(dirname, { recursive: true });
    } catch (err) {
      console.error("Failed to create directories:", err);
      reject(err);
      return;
    }

    const fileStream = fs.createWriteStream(downloadPath);
    s3.getObject(params).createReadStream().pipe(fileStream);

    fileStream.on('close', () => resolve(downloadPath));
    fileStream.on('error', reject);
  });
};

const uploadFile = async (req, res) => {
  try {
    const { username, type } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const key = `${username}/${type}/${file.originalname}`;
    await uploadToS3(file.path, process.env.AWS_BUCKET_NAME, key);
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error.message });
  }
};

const listUserFiles = async (req, res) => {
  try {
    const { username, type } = req.body;
    const prefix = `${username}/${type}/`;
    const fileNames = await listFilesInS3Directory(process.env.AWS_BUCKET_NAME, prefix);
    res.status(200).json({ fileNames });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { username, type, filename } = req.body;
    const key = `${username}/${type}/${filename}`;
    const localFilePath = path.join(__dirname, `../${username}/${type}/filename`);

    await downloadFromS3(process.env.AWS_BUCKET_NAME, key, localFilePath)

    //console.log("File saved successfully");
    // Respond with success message and localFilePath
    //res.status(200).json({ message: 'File downloaded successfully' });
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  uploadFile,
  uploadToS3,
  listUserFiles,
  listFilesInS3Directory,
  downloadFile,
  downloadFromS3
};
