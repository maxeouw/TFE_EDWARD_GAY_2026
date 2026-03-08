// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
};

function EventCard({ event }: { event: Event }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.badge}>{event.sport}</Text>
        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={14} color="#4B5563" />
          <Text style={styles.distanceText}>{event.distanceKm.toFixed(1)} km</Text>
        </View>
      </View>

      <Text style={styles.eventTitle} numberOfLines={1}>
        {event.title}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission localisation refusée");
        setLoading(false);
        return;
      }

      await Location.getCurrentPositionAsync({});

      const mockEvents: Event[] = [
        { id: "1", title: "Match de foot 5v5", sport: "Football", distanceKm: 1.2 },
        { id: "2", title: "Session running park", sport: "Running", distanceKm: 3.5 },
        { id: "3", title: "Basket 3x3", sport: "Basketball", distanceKm: 2.1 },
      ];

      setEvents(mockEvents);
      setLoading(false);
    })();
  }, []);

  if (loading || errorMsg) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.center}>
          {loading && <ActivityIndicator />}
          {errorMsg && <Text>{errorMsg}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Événements près de chez toi</Text>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#F3F4F6",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 24, fontWeight: "700", marginBottom: 16, color: "#111827" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "600",
  },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distanceText: { fontSize: 12, color: "#4B5563" },
  eventTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
});
