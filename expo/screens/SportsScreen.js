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
    sportsManager.getData(new Date(2019, 9, 28), this)
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
          color="#00ff00"/>
      </View>
    )
  } else {
    events = sportsData["events"]
    lines = []
    for (var i = 0; i < events.length; i++) {
      lines.push(
        <Text>
          { events[i] }
        </Text>);
    }
    return (
      <View>
        { lines }
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
