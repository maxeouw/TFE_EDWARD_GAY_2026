// app/map.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MapScreen from "../../components/map-screen";

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

  return <MapScreen events={events} />;
}
