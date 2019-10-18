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

export default class SettingsScreen extends Component {
  state = {
    modalVisible: false
  };
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  showGradePopup = () => {
    this.setState({modalVisible: true});
  };
  //return <ExpoConfigView />;
  render() {
    //console.log("modalVisible: " + this.state.modalVisible);
    return (
      <View>
        <View style={styles.statusBarBackground} />
        <Button title="Set Grade"
          onPress={this.showGradePopup}
          style={styles.calendarButton}
          color={(Platform.OS === 'ios') ? "#fff" : ""} />
          <View>
            <UserInfoScreen visible={this.state.modalVisible} pagekey={"uniquekey"} title={"Enter your grade:"} description={"This will help us adjust the app to your individual schedule."}/>
          </View>
      </View>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: 'Settings',
};

const styles = StyleSheet.create({
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : 0,
    backgroundColor: "#0185DE",
  },
});
