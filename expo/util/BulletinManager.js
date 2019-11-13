
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

  //gets the most recent date that we have data for
  getRecentDate(bulletinScreen) {
    bulletinScreen.setState({loadingDates: true, validDates: []});
    month = new Date();
    var thisYear = month.getFullYear();
    var thisMonth = month.getMonth() + 1;
    thisMonthString = thisMonth.toString();
    if (thisMonthString.length == 1) {
      thisMonthString = "0" + thisMonthString;
    }
    s3 = this.s3;
    manager = this;
    this.s3.list("v0/bulletin/" + thisYear.toString() + "-" + thisMonthString, function(thisDates) {
      newDate = new Date(thisYear, thisMonth - 2, 1);
      prevYear = newDate.getFullYear();
      prevMonth = newDate.getMonth() + 1;
      prevMonthString = prevMonth.toString();
      if (prevMonthString.length == 1) {
        prevMonthString = "0" + prevMonthString;
      }
      s3.list("v0/bulletin/" + prevYear.toString() + "-" + prevMonthString, function(prevDates) {
        allRecentDates = prevDates.concat(thisDates);
        manager.getData(new Date(allRecentDates[allRecentDates.length - 1]), bulletinScreen);
      });
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
    this.s3.get("v0/bulletin/" + year.toString() + "-" + monthString + "/" + dayString + ".json", null, function(data, nothing) {
      //console.log(data);
      bulletinScreen.setState({bulletinData: data, loadingBulletin: false});
    });
  }
}
