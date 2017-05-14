import React, { Component } from 'react';
import { Screen, Spinner, Title } from '@shoutem/ui';
import { stringify as queryString } from 'query-string';

import { CLIENT_ID, CLIENT_SECRET } from './config';
import RecomendationsMap from './recomendations_map';
import { OverlayTopics, BottomTopics } from './topics';

const FOURSQUARE_ENDPOINT = 'https://api.foursquare.com/v2/venues/explore';
const API_DEBOUNCE_TIME = 2000; // 2 seconds
const Console = console;

class App extends Component {
  constructor(props) {
    super(props);

    this.onRegionChange = this.onRegionChange.bind(this);
    this.onTopicSelect = this.onTopicSelect.bind(this);
  }

  state = {
    mapRegion: null,
    gpsAccuracy: null,
    recomendations: [],
    lookingFor: null,
    headerLocation: null,
    last4sqCall: null,
  }

  componentWillMount() {
    this.watchID = navigator.geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
        this.onRegionChange(region, position.coords.accuracy);
      },
      (error) => {
        Console.log('error', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region, gpsAccuracy) {
    this.fetchVenues(region);

    this.setState({
      mapRegion: region,
      gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy,
    });
  }

  onTopicSelect(lookingFor) {
    this.fetchVenues(this.state.mapRegion, lookingFor);
    this.setState({ lookingFor });
  }

  watchID = null;

  fetchVenues(region, lookingFor) {
    if (!this.shouldFetchVenues(lookingFor)) return;

    const query = this.venuesQuery(region, lookingFor);

    fetch(`${FOURSQUARE_ENDPOINT}?${query}`)
      .then(fetch.throwErrors)
      .then(res => res.json())
      .then((json) => {
        if (json.response.groups) {
          this.setState({
            recomendations: json.response.groups.reduce((all, g) => all.concat(g ? g.items : []), []),
            headerLocation: json.response.headerLocation,
            last4sqCall: new Date(),
          });
        }
      })
      .catch(err => Console.log(err));
  }

  venuesQuery({ latitude, longitude }, lookingFor) {
    return queryString({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      v: 20170305,
      ll: `${latitude}, ${longitude}`,
      llAcc: this.state.gpsAccuracy,
      section: lookingFor || this.state.lookingFor || 'food',
      limit: 10,
      openNow: 1,
      venuePhotos: 1,
    });
  }

  shouldFetchVenues(lookingFor) {
    return lookingFor !== this.state.lookingFor
      || this.state.last4sqCall === null
      || new Date() - this.state.last4sqCall > API_DEBOUNCE_TIME;
  }

  render() {
    const { mapRegion, lookingFor, headerLocation } = this.state;
    if (mapRegion) {
      return (
        <Screen>
          <Title styleName="h-center multiline" style={{ backgroundColor: 'rgba(255, 255, 255, .7)', paddingTop: 20 }}>
            {lookingFor ? `${lookingFor} in` : ''} {headerLocation}
          </Title>
          <RecomendationsMap {...this.state} onRegionChange={this.onRegionChange} />
          {!lookingFor ? <OverlayTopics onTopicSelect={this.onTopicSelect} /> : <BottomTopics onTopicSelect={this.onTopicSelect} />}
        </Screen>
      );
    }

    return (
      <Screen
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner styleName="large" />
      </Screen>
    );
  }
}

export default App;
