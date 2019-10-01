import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import BulletinScreen from '../screens/BulletinScreen';
import SportsScreen from '../screens/SportsScreen';
import SettingsScreen from '../screens/SettingsScreen';

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
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-list-box'
      }
    />
  ),
};

BulletinStack.path = '';

const SportsStack = createStackNavigator(
  {
    Sports: SportsScreen,
  },
  config
);

SportsStack.navigationOptions = {
  tabBarLabel: 'Sports',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-american-football'} />
  ),
};

SportsStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);
//md-calendar
SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-settings'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  BulletinStack,
  SportsStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
