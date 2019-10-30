
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
            // v0/bulletin/2019-10/01.json -> 2019-10/01
            dateStr = key.slice(12, 22);
            // js is stupid; 2019-10-1 gives prev day, 2019/10/1 gives correct day
            dateStr = dateStr.replace("-", "/");
            keys.push(new Date(dateStr).getTime());
          }
        }
        callback(keys);
      }
    })
  }

  get(key, extra, callback) {
    this.s3.getObject({Bucket: this.bucketName, Key: key}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        callback(JSON.parse(data.Body), extra);
      }
    })
  }
}
