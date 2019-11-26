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
    grade: 9
  };

  setGrade = (grade) => {
    //store user's Grade
    AsyncStorage.setItem("gradekey", JSON.stringify({"grade": grade}), (err,result) => {
      console.log("error",err,"result",result);
    });
    console.log("Setting grade to: " + grade);
    this.setState({grade: grade});
  }

  render() {
    return (
      <View>
        <NavigationEvents
          onWillFocus={payload => {
            console.log("will focus", payload);
            //get the grade that was saved
            AsyncStorage.getItem("gradekey", (err, result) => {
              if (!err) {
                //otherwise, load in grade
                data = JSON.parse(result);
                if (this.state.grade != data["grade"]) {
                  this.setState({grade: data["grade"]});
                }
              }
            });
          }}
        />
        <Header title={"Bell Schedule"}>
          <Picker
            selectedValue={this.state.grade + ""}
            style={styles.gradePicker}
            onValueChange={(itemValue, itemIndex) => this.setGrade(parseInt(itemValue))}>
            <Picker.Item label="9th Grade" value="9" />
            <Picker.Item label="10th Grade" value="10" />
            <Picker.Item label="11th Grade" value="11" />
            <Picker.Item label="12th Grade" value="12" />
          </Picker>
        </Header>
        { gradeLoader.getView(this.state.grade) }
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
