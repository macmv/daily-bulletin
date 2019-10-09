import * as WebBrowser from 'expo-web-browser';
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
import Modal from "react-native-modal";
import { MonoText } from '../components/StyledText';
import { Calendar } from '../components/Calendar';
import BulletinManager from '../util/BulletinManager';
import moment from 'moment';
import PropTypes from 'prop-types';
import UserInfoScreen from '../components/UserInfoScreen';

export default class BulletinScreen extends Component {
  state = {
    isModalVisible: false,
    bulletinData: null,
    loadingBulletin: false
  };

  showPopup = () => {
    bulletinManager.getAvailableDates(new Date(), this);
    this.setState({isModalVisible: true, selectedMonth: new Date()});
  };

  hidePopup = () => {
    this.setState({isModalVisible: false});
  };

  onSelectDate = (date) => {
    this.setState({loadingBulletin: true, selectedDate: date});
    bulletinManager.getData(date, this);
    this.hidePopup();
  }

  setMonth(month) {
    console.log("Setting month to: " + month);
    bulletinManager.getAvailableDates(month, this);
    this.setState({selectedMonth: month});
  }
  /*
  <View>
      <UserInfoScreen pagekey={"uniquekey"} title={"category title"} description={"topic description"}/>
  </View>
  */
  render() {
    return (
      //bulletin elements
      <View>
        <View style={styles.statusBarBackground} />
        <View style={styles.linearLayoutBackground}>
          <Text style={styles.titleLight}>NHHS Daily Bulletin</Text>
          <Button title="Calendar"
            onPress={this.showPopup}
            style={styles.calendarButton}
            color={(Platform.OS === 'ios') ? "#fff" : ""} />
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.calendarPopup}>
            <Calendar isModalVisible={this.state.isModalVisible} validDates={this.state.validDates} month={this.state.selectedMonth} bulletinScreen={this} onPress={this.onSelectDate}/>
            <View style={{flexDirection: 'row'}}>
              {this.state.loadingDates ?
                <ActivityIndicator size="small" color="#00ff00" /> : null}
              <View style={{flex:1}}/>
              <Button title="Cancel"
              color={(Platform.OS === 'ios') ? "#fff" : ""}
              onPress={this.hidePopup} />
            </View>
          </View>
        </Modal>
        <View style={styles.linearLayout}>
          <BulletinElement date={this.state.selectedDate} bulletin={this.state.bulletinData} loading={this.state.loadingBulletin} />
          <View>
            <UserInfoScreen pagekey={"uniquekey"} title={"category title"} description={"topic description"}/>
          </View>
        </View>
      </View>
    );
  }
}

var bulletinManager = new BulletinManager("daily-bulletin")

function BulletinElement(props) {
  if (props.loading) {
    return (
      <View style={styles.linearLayout}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  } else {
    bulletin = props.bulletin
    if (bulletin === null) {
      return (
        <View style={styles.linearLayout}>
        </View>
      )
    }
    sections = [];
    sections.push(
      <View>
        <Text style={styles.title}>Sports</Text>
        <Text style={styles.text}></Text>
      </View>
    )
    for (i = 1; i < bulletin.sports.length; i++) {
      text = bulletin.sports[i];
      regex = RegExp(', \\d+/\\d+:', 'g');
      match = regex.exec(text);
      if (match !== null) {
        index = regex.lastIndex
        sections.push(
          <View>
            <Text style={styles.subtitle}>{text.slice(0, regex.lastIndex - 1)}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
        sections.push(
          <View>
            <Text style={styles.text}>{text.slice(regex.lastIndex + 1)}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
      } else {
        sections.push(
          <View>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
      }
    }
    sections.push(
      <View>
        <Text style={styles.title}>Other</Text>
        <Text style={styles.text}></Text>
      </View>
    )
    for (i = 1; i < bulletin.other.length; i++) {
      text = bulletin.other[i];
      regex = RegExp('[A-Z]{2,}[A-Z,\\s]+[^\\sa-z]?', 'g');
      match = regex.exec(text);
      if (match !== null) {
        subtitle = text.slice(0, regex.lastIndex).trim();
        if (subtitle[subtitle.length - 1] === ".") {
          subtitle = subtitle.slice(0, subtitle.length - 1);
        }
        if (subtitle === "***QUICK LINKS*") {
          continue;
        }
        sections.push(
          <View>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
        content = text.slice(regex.lastIndex).trim();
        sections.push(
          <View>
            <Text style={styles.text}>{content}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
      } else {
        sections.push(
          <View>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
      }
    }
    return (
      <ScrollView style={styles.linearLayout, {flex: 1, marginBottom: 100}}>
        <Text style={styles.title}>Daily bulletin for {moment(props.date).format('dddd, MMMM Do YYYY')}</Text>
        {sections}
      </ScrollView>
    )
  }
}

BulletinScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  subtitle: {
    color: '#222',
    width: '100%',
    padding: 10,
    paddingLeft: 20,
    fontSize: 18
  },
  title: {
    color: '#222',
    textAlign: 'center',
    width: '100%',
    padding: 20,
    fontSize: 20
  },
  text: {
    color: '#222',
    fontSize: 15,
  },
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
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  linearLayout: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  linearLayoutVertical: {
    flex: 0,
    flexDirection: "column",
    padding: 10
  },
  linearLayoutVerticalBackground: {
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
  statusBarBackground: {
    height: (Platform.OS === 'ios') ? 18 : 0,
    backgroundColor: "#0185DE",
  },
  calendarPopup: {
    flex: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10,
    borderRadius: 10
  }
});
