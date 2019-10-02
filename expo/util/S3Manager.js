
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

  // this is expensive; use minimally
  list(prefix, callback) {
    this.s3.listObjects({Bucket: this.bucketName, Prefix: prefix}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        keys = [];
        contents = data.Contents;
        for (i = 0; i < contents.length; i++) {
        key = contents[i].Key;
          if (key.endsWith(".json")) {
            dateStr = key.slice(12, 22);
            dateStr = dateStr.replace("-", "/");
            keys.push(new Date(dateStr).getTime());
          }
        }
        callback(keys);
      }
    })
  }

  read(key) {

  }
}
