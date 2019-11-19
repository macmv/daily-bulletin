
import S3Manager from "./S3Manager";

export default class EventsManager {
  constructor(bucketName) {
    this.s3 = new S3Manager(bucketName);
  }

  getAvailableDates(month, eventsScreen) {
    eventsScreen.setState({loadingEvents: true, validDates: []});
    var year = month.getFullYear();
    var month = month.getMonth() + 1;
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    this.s3.list("v0/sports/" + year.toString() + "-" + monthString, function(dates) {
      eventsScreen.setState({validDates: dates, loadingEvents: false});
    });
  }

  getData(date, daysBack, eventsScreen) {
    eventsScreen.setState({eventsData: null, loadingEvents: true});
    allData = {};
    dayInMillis = 86400000;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    monthString = month.toString();
    if (monthString.length == 1) {
      monthString = "0" + monthString;
    }
    s3 = this.s3;
    this.s3.list("v0/sports/" + year.toString() + "-" + monthString, function(dates) {
      startDate = new Date(date.getTime() - dayInMillis * daysBack);
      var year = startDate.getFullYear();
      var month = startDate.getMonth() + 1;
      monthString = month.toString();
      if (monthString.length == 1) {
        monthString = "0" + monthString;
      }
      validDates = dates;
      this.s3.list("v0/sports/" + year.toString() + "-" + monthString, function(dates) {
        validDates = validDates.concat(dates);
        totalDays = 0;
        for (var i = 0; i < daysBack; i++) {
          if (validDates.includes(date.getTime() - dayInMillis * i)) {
            totalDays += 1;
            this.s3.get("v0/sports/" + generateDateString(new Date(date.getTime() - dayInMillis * i)) + ".json", i, function(data, extra) {
              allData[date.getTime() - dayInMillis * extra] = data;
              if (Object.keys(allData).length >= totalDays) {
                eventsScreen.setState({eventsData: allData, loadingEvents: false});
              }
            });
          }
        }
      });
    });
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
