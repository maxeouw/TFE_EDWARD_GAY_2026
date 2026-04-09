// app/(tabs)/map.tsx
import React from "react";
import MapScreen from "../../components/map-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MapPage() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <MapScreen />
    </SafeAreaView>
  );
}
