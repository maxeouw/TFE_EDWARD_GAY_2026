// components/map-screen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
};

// Données hardcodées ici — à remplacer par Firestore plus tard
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Foot 5v5",
    sport: "Football",
    distanceKm: 1.2,
    latitude: 50.8503,
    longitude: 4.3517,
  },
  {
    id: "2",
    title: "Running Parc",
    sport: "Running",
    distanceKm: 3.5,
    latitude: 50.845,
    longitude: 4.365,
  },
  {
    id: "3",
    title: "Basket 3x3",
    sport: "Basketball",
    distanceKm: 2.1,
    latitude: 50.858,
    longitude: 4.340,
  },
];

const INITIAL_REGION = {
  latitude: 50.8503,
  longitude: 4.3517,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
      >
        {mockEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.latitude,
              longitude: event.longitude,
            }}
            pinColor="#2563EB"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{event.title}</Text>
                <Text style={styles.calloutSport}>{event.sport}</Text>
                <Text style={styles.calloutDistance}>
                  {event.distanceKm.toFixed(1)} km
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    maxWidth: 200,
    padding: 4,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  calloutSport: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 2,
  },
  calloutDistance: {
    fontSize: 12,
    color: "#6B7280",
  },
});