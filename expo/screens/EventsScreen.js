import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import moment from 'moment';
import Header from './Header';
import EventsManager from '../util/EventsManager';

export default class EventsScreen extends Component {
  state = {
    eventsData: null,
    loadingEvents: false
  }
  componentDidMount = () => {
    today = new Date();
    eventsManager.getData(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), 28, this)
  }
  render() {
    return (
      <View>
        <Header title={"Upcoming Events"} />
        <View style={styles.linearLayout}>
          <GenerateEventsScreen data={this.state.eventsData} />
        </View>
      </View>
    );
  }
}

//parse events emojis for different events :)
function parseEvents(text) {
  dict = {
    "country" : "\u{1F3C3}",
    "cross-country" : "\u{1F3C3}",
    "track" : "\u{1F3C3}",
    "basketball" : "\u{1F3C0}",
    "volleyball" : "\u{1F3D0}",
    "wrestling" : "\u{1F93C}",
    "music" : "\u{1F3BC}",
    "jazz" : "\u{1F3B7}",
    "art" : "\u{1F3AD}",
    "arts" : "\u{1F3AD}",
    "swimming" : "\u{1F3CA}",
    "gymnastics" : "\u{1F938}",
    "golf" : "\u{1F3CC}",
    "tennis" : "\u{1F3BE}",
    "baseball" : "\u{1F6BE}",
    "softball" : "\u{1F94E}",
    "lacrosse" : "\u{1F94D}",
    "soccer" : "\u{26BD}",
    "futbal" : "\u{26BD}",
    "frisbee" : "\u{1F24F}",
    "football" : "\u{1F3C8}",
    "rugby" : "\u{1F3C9}",
    "athletes" : "\u{1F45F}",
    "athletic" : "\u{1F45F}",
  };
  emojiText = "";
  words = text.split(" ");
  for (var i = 0; i < words.length; i++) {
    emojiText = emojiText.concat(words[i] + " ")
    for (var key in dict) {
      if (words[i].toLowerCase() == key) {
        emojiText = emojiText.concat(dict[key] + " ");
      }
    }
  }
  return emojiText;
}

function GenerateEventsScreen(props) {
  eventsData = props["data"];
  if (eventsData === null) {
    return (
      <View style={{justifyContent: 'center', width: '100%'}}>
        <ActivityIndicator
          size="large"
          color="#0185DE"/>
      </View>
    )
  } else {
    sections = [];
    eventsDataKeys = Object.keys(eventsData);
    eventsDataKeys.sort();
    for (var i = eventsDataKeys.length - 1; i >= 0; i--) {
      dateString = eventsDataKeys[i];
      events = eventsData[dateString]["events"];
      lines = []
      for (var j = 0; j < events.length; j++) {
        emojiText = parseEvents(events[j]);
        lines.push(
          <Text style={styles.text}>
            <Text>- </Text>
            <Text>{ emojiText }</Text>
          </Text>);
      }
      date = new Date(parseInt(dateString));
      sections.push(
        <View>
          <Text style={styles.subtitle}>{
            date.getFullYear() == new Date().getFullYear() &&
            date.getMonth() == new Date().getMonth() &&
            date.getDay() == new Date().getDay() ?
            moment(date).format('dddd, MMMM Do') + " (Today)" :
            moment(date).format('dddd, MMMM Do')
          }</Text>
          <View>
            { lines }
          </View>
        </View>);
    }
    return (
      <ScrollView style={styles.linearLayout, {flex: 1, marginBottom: 100}}>
        { sections }
      </ScrollView>
    )
  }
}

var eventsManager = new EventsManager("daily-bulletin");

EventsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10,
  },
  subtitle: {
    color: '#a22',
    width: '100%',
    padding: 10,
    fontSize: 18,
  },
  text: {
    color: '#222',
    paddingLeft: 25,
    fontSize: 15,
  },
  linearLayout: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 0,
  },
});
