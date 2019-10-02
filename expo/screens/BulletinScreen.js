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
  ActivityIndicator,
} from 'react-native';
import Modal from "react-native-modal";
import { MonoText } from '../components/StyledText';
import BulletinManager from '../util/BulletinManager';

export default class BulletinScreen extends Component {
  state = {
    isModalVisible: false,
    validDates: []
  };

  showPopup = () => {
    this.setState({isModalVisible: true});
    bulletinManager.getAvailableDates(new Date(), this);
  };

  hidePopup = () => {
    this.setState({isModalVisible: false, validDates: []});
  };

  render() {
    return (
      <View>
        <View style={styles.linearLayout}>
          <Text style={styles.text}>NHHS Daily Bulletin</Text>
          <Button onPress={this.showPopup} style={styles.calendarButton} title="Calendar"/>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.linearLayout}>
            <Calendar validDates={this.state.validDates} bulletinScreen={this}/>
            {this.state.validDates.length == 0 ?
              <ActivityIndicator size="small" color="#00ff00" /> : null}
            <Button onPress={this.hidePopup} style={{width: '20%'}} title="Ok"/>
          </View>
        </Modal>
      </View>
    );
  }
}

var bulletinManager = new BulletinManager("daily-bulletin")

function Calendar(props) {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var firstDay = new Date(year, month, 1);
  var startDayOfWeek = firstDay.getDay(); // 0 = sunday, 6 = saturday
  var daysInMonth = new Date(year, month + 1, 0).getDate(); // js magic

  var calendarRows = [];
  for (var y = 0; y < 5; y++) {
    var row = [];
    for (var x = 0; x < 7; x++) {
      day = (y * 7 + x) - startDayOfWeek + 1;
      if (day > 0 && day <= daysInMonth) {
        disabled = !props.validDates.includes(new Date(year, month, day).getTime());
        row.push(
          <View style={styles.calendarNumber} key={y * 7 + x}>
            <Button disabled={disabled} title={day.toString()} />
          </View>
        );
      } else {
        row.push(
          <View style={styles.calendarNumber} key={y * 7 + x}>
          </View>
        );
      }
    }
    calendarRows.push(
      <View style={{flexDirection: 'row'}} key={y}>
        {row}
      </View>
    )
  }

  component = (
    <View style={{flexDirection: 'column', width: '80%'}}>
      {calendarRows}
    </View>
  )

  return component;
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
