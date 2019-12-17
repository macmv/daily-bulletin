import * as WebBrowser from 'expo-web-browser';
import React, { Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  AsyncStorage,
  Alert,
  ScrollView,
  Linking,
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
import Header from './Header';

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
        <Header title={"NHHS Daily Bulletin"}>
          <TouchableOpacity
            onPress={this.showPopup}
            color={(Platform.OS === 'ios') ? "#fff" : ""} >
            <Text style={styles.titleLight}>Calendar</Text>
          </TouchableOpacity>
        </Header>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.calendarPopup}>
            <Calendar
              isModalVisible={this.state.isModalVisible}
              validDates={this.state.validDates}
              month={this.state.selectedMonth}
              bulletinScreen={this}
              onPress={this.onSelectDate}/>
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
              title={"Select your grade"}
              description={"This will help us adjust the app to your individual schedule."}
            />
          </View>
        </View>
      </View>
    );
  }
}

var bulletinManager = new BulletinManager("daily-bulletin")

//parse lunch emojis for lunch foods :)
function parseLunch(text) {
  dict = {
    "cheese" : "\u{1F9C0}",
    "tomato" : "\u{1F345}",
    "soup" : "\u{1F372}",
    "bowl" : "\u{1F963}",
    "steak" : "\u{1F356}",
    "beef" : "\u{1F356}",
    "meat" : "\u{1F356}",
    "fries" : "\u{1F35F}",
    "chicken" : "\u{1F357}",
    "corndog" : "\u{1F32D}",
    "hotdog" : "\u{1F32D}",
    "sausage" : "\u{1F32D}",
    "dog" : "\u{1F32D}",
    "breadstick" : "\u{1F956}",
    "baguette" : "\u{1F956}",
    "choice" : "\u{1F468}\u{1F469}\u{1F373}",
    "bread" : "\u{1F35E}",
    "rolls" : "\u{1F35E}",
    "toast" : "\u{1F35E}",
    "rice" : "\u{1F35A}",
    "pancakes" : "\u{1F95E}",
    "salad" : "\u{1F957}",
    "caesar" : "\u{1F957}",
    "waffles" : "\u{1F9C7}",
    "penne" : "\u{1F35D}",
    "pasta" : "\u{1F35D}",
    "fish" : "\u{1F41F}",
    "chips" : "\u{1F35F}",
    "potato" : "\u{1F954}",
    "hashbrown" : "\u{1F954}",
    "turkey" : "\u{1F983}",
    "quesadilla" : "\u{1F32F}\u{1F9C0}",
    "tacos" : "\u{1F32E}",
    "hamburger" : "\u{1F354}",
    "cheeseburger" : "\u{1F354}",
    "pizza" : "\u{1F355}",
    "burrito" : "\u{1F32F}",
    "sandwich" : "\u{1F96A}",
    "sandwiches" : "\u{1F96A}",
    "peanut" : "\u{1F95C}",
    "nuts" : "\u{1F95C}",
    "squid" : "\u{1F991}\u{1F92E}"
  };
  emojiText = "";
  bulletinWords = (text.replace(",", "")).split(" ");

  for (var i = 0; i < bulletinWords.length; i++) {
    emojiText = emojiText.concat(bulletinWords[i] + " ")
    for (var key in dict) {
      if (bulletinWords[i].toLowerCase() == key) {
        emojiText = emojiText.concat(dict[key] + " ");
      }
    }
  }
  return emojiText;
}

function inArray(item, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (item == arr[i]) {
      return true;
    }
  }
  return false;
}

function BulletinElement(props) {
  if (props.loading) {
    return (
      <View style={styles.linearLayout}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  } else {
    bulletin = props.bulletin
    // if bulletin is null
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
    //display clubs
    if (bulletin.clubs != null) {
      sections.push(
        <View>
          <Text style={styles.title}>Clubs</Text>
          <Text style={styles.text}></Text>
        </View>
      )
      for (i = 0; i < bulletin.clubs.length; i++) {
        text = bulletin.clubs[i];
        sections.push(
          <View>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.text}></Text>
          </View>
        )
      }
    }
    //display lunch
    if (bulletin.lunch != null) {
      sections.push(
        <View>
          <Text style={styles.title}>Lunch</Text>
          <Text style={styles.text}></Text>
        </View>
      )
      for (i = 0; i < bulletin.lunch.length; i++) {
        emojiText = parseLunch(bulletin.lunch[i]);
        sections.push(
          <View>
            <Text style={styles.text}>{emojiText}</Text>
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
    const regexp = /\((http|mailto)\S*\)/g;
    for (i = 0; i < bulletin.other.length; i++) {
      text = bulletin.other[i];
      content = [];
      prevEnd = 0;
      let match;
      while ((match = regexp.exec(text)) !== null) {
        console.log(`Found ${match[0]} start=${match.index} end=${regexp.lastIndex}.`);
        link = match[0].trim();
        link = link.slice(1, link.length - 2);
        textSection = text.slice(prevEnd, match.index).trim();
        prevEnd = regexp.lastIndex;
        content.push(
          <Text style={styles.text}>{textSection}</Text>
        );
        content.push(
          <TouchableOpacity
            onPress={ ((value) => Linking.openURL(value)).bind(this, link) }
            color={(Platform.OS === 'ios') ? "#fff" : ""} >
            <Text style={styles.link}>Click Here</Text>
          </TouchableOpacity>
        );
      }
      content.push(
        <Text style={styles.text}>{text.slice(prevEnd)}</Text>
      );

      sections.push(
        <View>
          {content}
          <Text style={styles.text}></Text>
        </View>
      )
    }
    return (
      <ScrollView style={styles.linearLayout, {flex: 1}}>
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
  link: {
    color: '#26f',
    textDecorationLine: 'underline',
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
    paddingLeft: 10,
    paddingRight: 10,
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
