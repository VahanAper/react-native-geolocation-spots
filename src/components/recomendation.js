import React, { Component } from 'react';
import MapView from 'react-native-maps';
import {
  Card, Image, View, Subtitle, Caption,
} from '@shoutem/ui';

class Recomendation extends Component {
  get photo() {
    const photo = this.props.venue.photos.groups[0].items[0];

    return `${photo.prefix}300x500${photo.suffix}`;
  }

  render() {
    const { venue, tips } = this.props;

    return (
      <MapView.Marker
        coordinate={{
          latitude: venue.location.lat,
          longitude: venue.location.lng,
        }}
      >
        <MapView.Callout>
          <Card>
            <Image styleName="medium-wide" source={{ uri: this.photo }} />
            <View styleName="content">
              <Subtitle>{venue.name}</Subtitle>
              <Caption>{tips ? tips[0].text : ''}</Caption>
            </View>
          </Card>
        </MapView.Callout>
      </MapView.Marker>
    );
  }
}

export default Recomendation;
