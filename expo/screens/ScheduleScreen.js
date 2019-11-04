import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import GradeScheduleNavigator from './schedulescreens/GradeScheduleNavigator';

//const GradeIndex = createAppContainer(GradeScheduleNavigator);

export default class ScheduleScreen extends Component {
  state = {
    grade: 9
  };

  render() {
    //get the grade that was saved
    AsyncStorage.getItem("gradekey", (err, result) => {
      if (!err) {
        if (result == null) {
          this.setState({grade: "9"});
        } else {
          //otherwise, load in grade
          data = JSON.parse(result);
          this.setState({grade: data["grade"]});
        }
      }
    });
    return (
      <View>
        <GradeScheduleNavigator currentGrade={this.state.grade}/>
      </View>
    );
  };
}

ScheduleScreen.navigationOptions = {
  title: 'Schedule',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  linearLayoutVertical: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  /*tab-list {
    border-bottom: 1px solid #ccc;
    padding-left: 0;
  },
  tab-list-item {
    display: inline-block;
    list-style: none;
    margin-bottom: -1px;
    padding: 0.5rem 0.75rem;
  },
  tab-list-active {
    background-color: white;
    border: solid #ccc;
    border-width: 1px 1px 0 1px;
  }*/
});
