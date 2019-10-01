import * as WebBrowser from 'expo-web-browser';
import React, {
  Component
} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
} from 'react-native';
import Modal from "react-native-modal";
import { MonoText } from '../components/StyledText';

export default class BulletinScreen extends Component {
  state = {
    isModalVisible: false
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    return (
      <View>
        <View style={styles.linearLayout}>
          <Text style={styles.text}>NHHS Daily Bulletin</Text>
          <Button onPress={this.toggleModal} style={styles.calendarButton} title="Calendar"/>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.linearLayout}>
            <Calendar/>
            <Button onPress={this.toggleModal} style={{width: '20%'}} title="Ok"/>
          </View>
        </Modal>
      </View>
    );
  }
}

function Calendar(props) {
  var calendarRows = [];

  for (var y = 0; y < 5; y++) {
    var row = [];
    for (var x = 0; x < 7; x++) {
      row.push(
        <View style={styles.calendarNumber} key={y * 7 + x}>
          <Button disabled={false} title={x.toString()} />
        </View>
      );
    }
    calendarRows.push(
      <View style={{flexDirection: 'row'}} key={y}>
        {row}
      </View>
    )
  }

  console.log(calendarRows);

  return (
    <View style={{flexDirection: 'column', width: '80%'}}>
      {calendarRows}
    </View>
  )
}

BulletinScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#fff',
    padding: 20,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    height: 56,
    alignSelf: 'stretch',
    textAlign: 'left'
  },
  linearLayout: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  calendarButton: {
    backgroundColor: '#0185DE',
    color: "#fff",
    width: 20,
    height: 20
  },
  text: {
    color: '#fff',
    fontSize: 20,
  },
  calendarNumber: {
    flex: 1,
    aspectRatio: 1,
    margin: 5
  }
});
