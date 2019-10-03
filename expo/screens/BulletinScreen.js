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
import moment from 'moment';

export default class BulletinScreen extends Component {
  state = {
    isModalVisible: false
  };

  showPopup = () => {
    bulletinManager.getAvailableDates(new Date(), this);
    this.setState({isModalVisible: true, selectedMonth: new Date()});
  };

  hidePopup = () => {
    this.setState({isModalVisible: false});
  };

  onSelectDate = (date) => {
    Alert.alert("Day selected is: " + date);
    this.hidePopup();
  }

  setMonth(month) {
    console.log("Setting month to: " + month);
    bulletinManager.getAvailableDates(month, this);
    this.setState({selectedMonth: month});
  }

  render() {
    return (
      <View>
        <View style={styles.linearLayout}>
          <Text style={styles.text}>NHHS Daily Bulletin</Text>
          <Button onPress={this.showPopup} style={styles.calendarButton} title="Calendar"/>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.linearLayoutVertical}>
            <Calendar validDates={this.state.validDates} month={this.state.selectedMonth} bulletinScreen={this} onPress={this.onSelectDate}/>
            <View style={{flexDirection: 'row'}}>
              {this.state.loadedDates ? null :
                <ActivityIndicator size="small" color="#00ff00" />}
              <View style={{flex:1}}/>
              <Button onPress={this.hidePopup} title="Ok"/>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

var bulletinManager = new BulletinManager("daily-bulletin")

function Calendar(props) {
  var date = props.month;
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
        buttonDate = new Date(date.getFullYear(), date.getMonth(), day);
        row.push(
          <View style={styles.calendarNumber} key={y * 7 + x}>
            <Button disabled={disabled} title={day.toString()} onPress={props.onPress.bind(this, buttonDate)} />
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
    <View style={{flexDirection: 'column'}}>
      <View style={styles.linearLayout}>
        <Button title="Prev" onPress={() => {
          props.bulletinScreen.setMonth(new Date(props.month.getFullYear(), props.month.getMonth() - 1, 1));
        }}/>
        <Text style={styles.text}>{moment(props.month).format('MMMM')}</Text>
        <Button title="Next" onPress={() => {
          props.bulletinScreen.setMonth(new Date(props.month.getFullYear(), props.month.getMonth() + 1, 1));
        }}/>
      </View>
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
  linearLayoutVertical: {
    flex: 0,
    flexDirection: "column",
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
