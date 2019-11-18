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
import GradeLoader from "./schedulescreens/GradeLoader";
import Header from './Header';

//const GradeIndex = createAppContainer(GradeScheduleNavigator);
var gradeLoader = new GradeLoader();

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
          if (this.state.grade != data["grade"]) {
            this.setState({grade: data["grade"]});
          }
        }
      }
    });
    return (
      <View>
        <Header title={"Schedule"} />
        { gradeLoader.getView(this.state.grade) }
      </View>
    );
  };
}

ScheduleScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
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
});
