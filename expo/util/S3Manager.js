
import creds from './creds'
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: creds.access, secretAccessKey: creds.secret, region: 'us-west-2'
});

export default class S3Manager {
  constructor(bucketName) {
    this.s3 = new AWS.S3();
    this.bucketName = bucketName;
  }

  list(prefix) {
    this.s3.listObjects({Bucket: this.bucketName, Prefix: prefix}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        contents = data.Contents;
        for (i = 0; i < contents.length; i++) {
          console.log("Got key -> " + contents[i].Key);
        }
      }
    })
  }

  read(name) {

  }
}
