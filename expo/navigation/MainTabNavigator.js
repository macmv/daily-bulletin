import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import BulletinScreen from '../screens/BulletinScreen';
import EventsScreen from '../screens/EventsScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const BulletinStack = createStackNavigator(
  {
    Home: BulletinScreen,
  },
  config
);

BulletinStack.navigationOptions = {
  tabBarLabel: 'Bulletin',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'
      }
    />
  ),
};

BulletinStack.path = '';

const EventsStack = createStackNavigator(
  {
    Events: EventsScreen,
  },
  config
);

EventsStack.navigationOptions = {
  tabBarLabel: 'Events',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-calendar' : 'md-calendar'} />
  ),
};

EventsStack.path = '';

//Bell Schedule tab
const ScheduleStack = createStackNavigator(
  {
    Schedule: ScheduleScreen,
  },
  config
);

ScheduleStack.navigationOptions = {
  tabBarLabel: 'Schedule',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-clock' : 'md-clock'} />
  ),
};

ScheduleStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} />
  ),
};

SettingsStack.path = '';

//resources tab
const ResourcesStack = createStackNavigator(
  {
    Resources: ResourcesScreen,
  },
  config
);

ResourcesStack.navigationOptions = {
  tabBarLabel: 'Resources',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-open' : 'md-open'} />
  ),
};

ResourcesStack.path = '';

const tabNavigator = createBottomTabNavigator({
  BulletinStack,
  EventsStack,
  ScheduleStack,
  SettingsStack,
  ResourcesStack,
});

tabNavigator.path = '';

export default tabNavigator;
