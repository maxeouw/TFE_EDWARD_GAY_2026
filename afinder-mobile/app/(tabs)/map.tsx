// app/map.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MapScreen from "../../components/map-screen";
import { SafeAreaView } from "react-native-safe-area-context";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
};

export default function MapPage() {
  const params = useLocalSearchParams<{ events?: string }>();
  const events: Event[] = params.events ? JSON.parse(params.events as string) : [];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <MapScreen events={events} />
    </SafeAreaView>
  );
}
