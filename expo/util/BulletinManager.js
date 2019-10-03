
import S3Manager from "./S3Manager";

export default class BulletinManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month, bulletinScreen) {
    bulletinScreen.setState({loadingDates: true, validDates: []});
    var year = month.getFullYear();
    var month = month.getMonth() + 1;
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/bulletin/" + year.toString() + "-" + monthString, function(dates) {
      bulletinScreen.setState({validDates: dates, loadingDates: false});
    });
  }

  getData(date, bulletinScreen) {
    bulletinScreen.setState({bulletinData: null, loadingBulletin: true});
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    dayString = day.toString();
    if (dayString.length == 1) {
      dayString = "0" + dayString;
    }
    this.s3.get("v0/bulletin/" + year.toString() + "-" + monthString + "/" + dayString + ".json", function(data) {
      bulletinScreen.setState({bulletinData: data, loadingBulletin: false});
    });
  }
}
