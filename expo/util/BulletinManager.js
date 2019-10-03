
import S3Manager from "./S3Manager";

export default class BulletinManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month, bulletinScreen) {
    bulletinScreen.setState({loadedDates: false, validDates: []});
    var year = month.getFullYear();
    var month = month.getMonth() + 1;
    monthString = month.toString();
    if (month.toString().length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/bulletin/" + year.toString() + "-" + monthString, function(dates) {
      bulletinScreen.setState({validDates: dates, loadedDates: true});
    });
  }
}
