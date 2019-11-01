import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

import SportsManager from '../util/SportsManager';

export default class SportsScreen extends Component {
  state = {
    sportsData: null,
    loadingSports: false
  }
  componentDidMount = () => {
    sportsManager.getData(new Date(2019, 9, 28), 7, this)
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <GenerateSportsScreen data={this.state.sportsData} />
      </ScrollView>
    );
  }
}

function GenerateSportsScreen(props) {
  sportsData = props["data"];
  if (sportsData === null) {
    return (
      <View>
        <ActivityIndicator
          barStyle="large"
          color="#00ffa0"/>
      </View>
    )
  } else {
    console.log("Sports data:", sportsData);
    sections = [];
    for (var i = 0; i < Object.keys(sportsData).length; i++) {
      dateString = Object.keys(sportsData)[i];
      events = sportsData[dateString]["events"];
      lines = []
      for (var j = 0; j < events.length; j++) {
        lines.push(
          <Text>
            { events[j] }
          </Text>);
      }
      date = new Date(parseInt(dateString));
      console.log("Date:", date);
      sections.push(
        <View>
          <Text>{ date.getMonth() + 1 }/{ date.getDate() }</Text>
          <View>
            { lines }
          </View>
        </View>);
    }
    return (
      <View>
        { sections }
      </View>
    )
  }
  return null;
}

var sportsManager = new SportsManager("daily-bulletin");

SportsScreen.navigationOptions = {
  title: 'Sports',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
