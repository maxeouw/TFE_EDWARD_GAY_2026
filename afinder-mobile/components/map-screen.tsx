// map-screen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

type Event = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

type Props = {
  events: Event[];
};

export default function MapScreen({ events }: Props) {
  const initialRegion = {
    latitude: events[0]?.latitude ?? 50.8503, // ex: Bruxelles
    longitude: events[0]?.longitude ?? 4.3517,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
