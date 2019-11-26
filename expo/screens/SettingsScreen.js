import { ExpoConfigView } from '@expo/samples';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Picker,
  AsyncStorage,
} from 'react-native';
import UserInfoScreen from '../components/UserInfoScreen';
import Header from './Header';

export default class SettingsScreen extends Component {
  state = {
    modalVisible: false,
    grade: 9,
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
    //console.log("modalVisible: " + this.state.modalVisible);
    return (
      <View>
        <Header title={"Settings"} />
        <View style={styles.linearLayoutBackground}>
          <Text style={styles.gradeText}>Set Grade:</Text>
          <Picker
            selectedValue={this.state.grade + ""}
            style={styles.gradePicker}
            onValueChange={(itemValue, itemIndex) => this.setGrade(parseInt(itemValue))}>
            <Picker.Item label="9th Grade" value="9" />
            <Picker.Item label="10th Grade" value="10" />
            <Picker.Item label="11th Grade" value="11" />
            <Picker.Item label="12th Grade" value="12" />
          </Picker>
        </View>
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  gradeText: {
    flex: 1,
    fontSize: 20,
    padding: 10
  },
  gradePicker: {
    flex: 1
  },
  linearLayoutBackground: {
    paddingTop: 10,
    paddingBottom: 10,
    flex: 0,
    //backgroundColor: '#ff5c5c',
    flexDirection: "row",
  }
});
