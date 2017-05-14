import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';

import Recomendation from './recomendation';

class RecomendationsMap extends Component {
  renderRecomendations(recomendations) {
    return (
      recomendations.map(r => <Recomendation venue={r.venue} tips={r.tips} key={r.venue.id} />)
    );
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const {
      mapRegion, gpsAccuracy, recomendations, onRegionChange,
    } = this.props;

    return (
      <MapView.Animated
        region={mapRegion}
        style={{
          flex: 1,
          width,
          height,
        }}
        onRegionChange={onRegionChange}
      >
        <MapView.Circle
          center={mapRegion}
          radius={gpsAccuracy * 1.5}
          strokeWidth={0.5}
          strokeColor="rgba(66, 180, 230, 1)"
          fillColor="rgba(66, 180, 230, 0.2)"
        />
        <MapView.Circle
          center={mapRegion}
          radius={5}
          strokeWidth={0.5}
          strokeColor="rgba(66, 180, 230, 1)"
          fillColor="rgba(66, 180, 230, 0.2)"
        />
        {this.renderRecomendations(recomendations)}
      </MapView.Animated>
    );
  }
}

export default RecomendationsMap;
