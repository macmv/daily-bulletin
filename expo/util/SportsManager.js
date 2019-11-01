
import S3Manager from "./S3Manager";

export default class SportsManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month, sportsScreen) {
    sportsScreen.setState({loadingSports: true, validDates: []});
    var year = month.getFullYear();
    var month = month.getMonth() + 1;
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/sports/" + year.toString() + "-" + monthString, function(dates) {
      sportsScreen.setState({validDates: dates, loadingSports: false});
    });
  }

  getData(date, daysBack, sportsScreen) {
    sportsScreen.setState({sportsData: null, loadingSports: true});
    allData = {};
    dayInMillis = 86400000;
    for (var i = 0; i < daysBack; i++) {
      this.s3.get("v0/sports/" + generateDateString(new Date(date.getTime() + dayInMillis * i)) + ".json", i, function(data, extra) {
        allData[date.getTime() + dayInMillis * extra] = data;
        console.log(extra);
        if (extra >= daysBack - 3) {
          sportsScreen.setState({sportsData: allData, loadingSports: false});
        }
      });
    }
  }
}

function generateDateString(date) {
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
  return year.toString() + "-" + monthString + "/" + dayString
}
