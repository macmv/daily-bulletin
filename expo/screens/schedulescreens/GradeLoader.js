import React, {Component} from 'react';
import {
  View,
  Text,
} from 'react-native';
const schedule = require('./schedule.json');

export default class GradeLoader {
  getView(grade) {
    console.log(schedule);
    return (
      <View>
        <Text>GRADE DATA HERE</Text>
      </View>
    )
  }
}
