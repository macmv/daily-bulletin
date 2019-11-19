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
} from 'react-native';
import UserInfoScreen from '../components/UserInfoScreen';
import Header from './Header';

export default class SettingsScreen extends Component {
  state = {
    modalVisible: false
  };
  showGradePopup = () => {
    this.setState({modalVisible: true});
  };
  hideGradePopup = () => {
    this.setState({modalVisible: false});
  };
  render() {
    console.log("modalVisible: " + this.state.modalVisible);
    return (
      <View>
        <Header title={"Settings"} />
        <Button title="Set Grade"
          onPress={this.showGradePopup}
          style={styles.calendarButton}
          color={(Platform.OS === 'ios') ? "#fff" : ""} />
        <View>
          <UserInfoScreen
            key={"Settings"}
            hide={this.hideGradePopup.bind(this)}
            visible={this.state.modalVisible}
            title={"Update your grade"}
            description={"This will help us adjust the app to your individual schedule."}
          />
        </View>
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : 0,
    backgroundColor: "#0185DE",
  },
});
