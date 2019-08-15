/* eslint-disable class-methods-use-this */
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');

if (!keys.secretAccessKey) {
  console.log('please provide S3 User access keys!');
}

// make sure to specify signature version and region!
const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2',
});

class UploadService {
  constructor() {
    this.uploadS3 = this.uploadS3.bind(this);
  }

  uploadS3(req, res) {
    const key = `${req.user.id}/${uuid()}.jpeg`;
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'futureblog-bucket',
        ContentType: 'image/jpeg',
        Key: key,
      },
      (err, url) => {
        res.send({ key, url });
      },
    );
  }
}

module.exports = UploadService;
