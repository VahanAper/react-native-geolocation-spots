import React from 'react';
import MapView from 'react-native-maps';
import { Title } from '@shoutem/ui';

import styles from './styles';
import Recomendation from './recomendation';

const RecomendationsMap = ({
  mapRegion, gpsAccuracy, recomendations, lookingFor, headerLocation, onRegionChange,
}) => (
  <MapView.Animated
    region={mapRegion}
    style={styles.fullscreen}
    onRegionChange={onRegionChange}
  >
    <Title styleName="h-center multiline" style={styles.mapHeader}>
      {lookingFor ? `${lookingFor} in` : ''} {headerLocation}
    </Title>
    <MapView.Cicle
      center={mapRegion}
      radius={gpsAccuracy * 1.5}
      strokeWidth={0.5}
      strokeColor="rgba(66, 180, 230, 1)"
      fillColor="rgba(66, 180, 230, 0.2)"
    />
    <MapView.Cicle
      center={mapRegion}
      radius={5}
      strokeWidth={0.5}
      strokeColor="rgba(66, 180, 230, 1)"
      fillColor="rgba(66, 180, 230, 0.2)"
    />

    {recomendations.map(r => <Recomendation {...r} key={r.venue.id} />)}

  </MapView.Animated>
);

export default RecomendationsMap;
