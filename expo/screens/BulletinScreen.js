import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  AsyncStorage,
  Alert,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
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
    gradePopupVisible: false,
    isModalVisible: false,
    bulletinData: null,
    loadingBulletin: false,
  };
  lastMonth: [];
  currentMonth: [];
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

  setUserInfoScreenVisible = (visible) => {
    console.log("Set the visibility to: " + visible);
    this.setState({gradePopupVisible : visible});
  }

  componentDidMount() {
    //set the last date that we have data for and load the bullletin
    bulletinManager.getRecentDate(this);
  }

  render() {
    return (
      //bulletin elements
      <View>
        <View style={styles.statusBarBackground} />
        <View style={styles.linearLayoutBackground}>
          <Text style={styles.titleLight}>NHHS Daily Bulletin</Text>
          <TouchableOpacity
            onPress={this.showPopup}
            color={(Platform.OS === 'ios') ? "#fff" : ""} >
            <Text style={styles.titleLight}>Calendar</Text>
          </TouchableOpacity>
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
            <UserInfoScreen
              key={"Bulletin"}
              hide={this.setUserInfoScreenVisible.bind(this, false)}
              visible={this.state.gradePopupVisible}
              title={"Enter your grade:"}
              description={"This will help us adjust the app to your individual schedule."}
            />
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
    //if bulletin is null
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
      sections.push(
        <View>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.text}></Text>
        </View>
      )
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
