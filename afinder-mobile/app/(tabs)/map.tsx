// app/(tabs)/map.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import MapScreen from "../../components/map-screen";

export default function MapPage() {
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <MapScreen />
    </View>
  );
}
