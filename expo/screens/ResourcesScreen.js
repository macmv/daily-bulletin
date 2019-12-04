import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Header from './Header';

export default function ResourcesScreen() {
  return (
    <View>
      <Header title={"Resources"} />
      <ScrollView>
        <GenerateLinks />
        <Text style={styles.credits}>NHHS Bulletin Application developed by Neil Macneale V and Ethan Erickson { "\u{1F600}" }.</Text>
      </ScrollView>
    </View>
  );
}

function GenerateLinks() {
  links = {
    "Nathan Hale Foundation website:": "http://www.nathanhale.org",
    "Hale Sports Booster website:": "http://halesports.org",
    "Raider Gear:": "http://bit.ly/2cr6syY",
    "To purchase Yearbooks, ASB cards, pay fees and fines on-line:" : "Use parent/guardian Source Account then SchoolPay",
    "To pay for lunches on line:": "https://paypams.com/HomePage.aspx",
    "Seattle Schools website:": "http://www.seattleschools.org",
    "Scholarships/Colleges/Careers:": "http://halehs.seattleschools.org/services/counseling_office/colleges_and_careers",
    "For information and tickets to music concerts:": "https://nathanhalemusic.com/",
    "NHCO:": "https://halehs.seattleschools.org/school_involvement/nathan_hale_community_organization",
    "For information and tickets to theater productions:": "https://www.nathanhaletheatre.com/",
    "Senior Spree:": "https://nathanhalespree2020.shutterfly.com/",
    "Online Volunteer Application:": "https://seattlepublicschools.volunteerlocal.com/volunteer/",
    "Nathan Hale Music Boosters:": "https://nathanhalemusic.com/",
    "Seattle Promise Contact:": "Francisco Ramos Francisco.Ramos@Seattlecolleges.edu"
  }
  list = [];
  for (name in links) {
    link = links[name]
    list.push(
      <View>
        <Text style={styles.text}> { name } </Text>
          {
          (link[0] + link[1] + link[2] + link[3]) == "http" ?
          <TouchableOpacity
            onPress={ ((value) => Linking.openURL(value)).bind(this, link) }
            color={(Platform.OS === 'ios') ? "#fff" : ""} >
            <Text style={styles.link}> { link } </Text>
          </TouchableOpacity> :
          <Text> { link } </Text>
          }
      </View>
    );
  }
  return list;
}

ResourcesScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  link: {
    color: '#26f',
    textDecorationLine: 'underline',
  },
  titleLight: {
    color: '#fff',
    fontSize: 20
  },
  linearLayoutBackground: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#0185DE',
    padding: 10
  },
  credits: {
    paddingTop: 30,
    paddingBottom: 50
  }
});
