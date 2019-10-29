
import S3Manager from "./S3Manager";

export default class SportsManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month, sportsScreen) {
    sportsScreen.setState({loadingDates: true, validDates: []});
    var year = month.getFullYear();
    var month = month.getMonth() + 1;
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/sports/" + year.toString() + "-" + monthString, function(dates) {
      sportsScreen.setState({validDates: dates, loadingDates: false});
    });
  }

  getData(date, sportsScreen) {
    sportsScreen.setState({sportsData: null, loadingSports: true});
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
    this.s3.get("v0/sports/" + year.toString() + "-" + monthString + "/" + dayString + ".json", function(data) {
      sportsScreen.setState({sportsData: data, loadingSports: false});
    });
  }
}
