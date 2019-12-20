import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Picker,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { createAppContainer, createSwitchNavigator, NavigationEvents } from 'react-navigation';
import GradeLoader from "./schedulescreens/GradeLoader";
import Header from './Header';

//const GradeIndex = createAppContainer(GradeScheduleNavigator);
var gradeLoader = new GradeLoader();

export default class ScheduleScreen extends Component {
  state = {
    grade: -1
  };

  setGrade = (grade) => {
    AsyncStorage.setItem("gradekey", JSON.stringify({"grade": grade}), (err,result) => {
      if (err) {
        console.log("Cannot set item, error:", err, ", result:", result);
      }
    });
    this.setState({grade: grade});
  }

  render() {
    console.log("Grade in SC is:", this.state.grade);
    if (this.state.grade != -1) {
      gradeView = gradeLoader.getView(this.state.grade);
    } else {
      gradeView = <View></View>;
    }
    return (
      <View>
        <NavigationEvents
          onWillFocus={payload => {
            AsyncStorage.getItem("gradekey", (err, result) => {
              if (!err) {
                data = JSON.parse(result);
                grade = data["grade"];
                if (this.state.grade != grade) {
                  this.setState({grade: grade});
                }
              }
              console.log("Got grade from async", result);
            });
          }}
        />
        <Header title={"Bell Schedule"}>
        </Header>
        { gradeView }
      </View>
    );
  };
}

ScheduleScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  gradePicker: {
    flex: 0.75,
    color: '#fff',
    height: 20
  },
});
