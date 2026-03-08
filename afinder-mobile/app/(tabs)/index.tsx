// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
};

function EventCard({ event }: { event: Event }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
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

      {event.date && (
        <Text style={styles.dateText}>
          {event.date} • {event.time}
        </Text>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.slotsRow}>
          <Ionicons name="people-outline" size={16} color="#4B5563" />
          <Text style={styles.slotsText}>
            {event.remainingSlots}/{event.totalSlots} places
          </Text>
        </View>
        <Text style={styles.ctaText}>Voir les détails</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission localisation refusée");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);


      const mockEvents: Event[] = [
        { id: "1", title: "Match de foot 5v5", sport: "Football", distanceKm: 1.2 },
        { id: "2", title: "Session running park", sport: "Running", distanceKm: 3.5 },
        { id: "3", title: "Basket 3x3", sport: "Basketball", distanceKm: 2.1 },
      ];

      setEvents(mockEvents);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Chargement des événements...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: "#F3F4F6" },
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

  eventTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  dateText: { fontSize: 13, color: "#6B7280", marginBottom: 10 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  slotsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  slotsText: { fontSize: 13, color: "#4B5563" },
  ctaText: { fontSize: 13, color: "#2563EB", fontWeight: "600" },
});
