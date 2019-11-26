import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment';
const schedule = require('./schedule.json');

export default class GradeLoader {
  getView(gradeNum) {
    grade = schedule.grades[gradeNum];
    days = {};
    Object.entries(grade).forEach(item => {
      day = item[0];
      data = item[1];
      rows = [];
      data.forEach(subject => {
        rows.push(
          <View style={{flexDirection: "row"}}>
            <Text style={[{flex: 2}, styles.itemLeft]}>{ subject.title }</Text>
            <Text style={[{flex: 1}, styles.item]}>{ parseTimeInt(subject.start) }</Text>
            <Text style={[{flex: 1}, styles.item]}>{ parseTimeInt(subject.end) }</Text>
          </View>
        );
      });
      title = moment().day(day).format('dddd');
      console.log(title);
      if (title == "Monday") {
        title += "/Friday";
      }
      if (moment().day(day).format('dddd') == moment().format('dddd')) {
        title += " (Today)";
      }
      days[day] =
        <View>
          <Text></Text>
          <View style={{flexDirection: "row"}}>
            <Text style={[{flex: 2}, styles.header]}>{ title }</Text>
            <Text style={[{flex: 1}, styles.headerSpacer]}></Text>
            <Text style={[{flex: 1}, styles.headerSpacer]}></Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={[{flex: 2}, styles.boldLeft]}>Subject</Text>
            <Text style={[{flex: 1}, styles.bold]}>Start Time</Text>
            <Text style={[{flex: 1}, styles.bold]}>End Time</Text>
          </View>
          { rows }
        </View>;
    });
    table = [];
    for (i = 0; i < 7; i++) {
      day = moment().add(i, 'day').format('ddd');
      //console.log("keys", Object.keys(days));
      //console.log("key", day);
      if (days[day] != undefined) {
        table.push(days[day]);
      }
    }
    return (
      <ScrollView style={styles.container}>
        { table }
      </ScrollView>
    )
  }
}

function parseTimeInt(time) {
  hour = Math.floor(time / 100)
  minute = time % 100
  if (("" + minute).length == 1) {
    return hour + ":" + minute + "0";
  }
  return hour + ":" + minute
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  item: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    paddingLeft: 5,
    fontSize: 18,
  },
  itemLeft: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000",
    paddingLeft: 5,
    fontSize: 18,
  },
  bold: {
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    fontWeight: 'bold',
    paddingLeft: 5,
    fontSize: 18,
  },
  boldLeft: {
    borderWidth: 1,
    borderColor: "#000",
    fontWeight: 'bold',
    paddingLeft: 5,
    fontSize: 18,
  },
  header: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000",
    paddingLeft: 5,
    fontSize: 18,
  },
  headerSpacer: {
    borderRightWidth: 1,
    borderColor: "#fff",
    paddingLeft: 5,
  }
});
