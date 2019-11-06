import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';
const schedule = require('./schedule.json');

export default class GradeLoader {
  getView(gradeNum) {
    grade = schedule.grades[gradeNum];
    table = [];
    Object.entries(grade).forEach(item => {
      data = item[1];
      data.forEach(subject => {
        table.push(
          <View>
            <Text>{ subject.title }</Text>
          </View>
        );
      });
    });
    console.log(table);
    return (
      <View>
        { table }
      </View>
    )
  }
}
