import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import App from './src/components/app';

export default class geolocationSpots extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('geolocation_spots', () => geolocationSpots);
