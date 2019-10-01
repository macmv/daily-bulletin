
import S3Manager from "./S3Manager";

export default class BulletinManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month) {
    var year = month.getFullYear();
    var month = month.getMonth();
    monthString = month.toString();
    if (month.toString().length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/bulletin/" + year.toString() + "-" + monthString);
  }
}
