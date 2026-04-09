// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
};

// TODO: remplacer par l'URL de ta vraie photo Firebase Auth
const PROFILE_PHOTO_URL =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&w=256&h=256&q=80";

function HomeHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* Avatar cliquable → profil */}
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        activeOpacity={0.8}
        style={styles.avatarButton}
      >
        <Image source={{ uri: PROFILE_PHOTO_URL }} style={styles.avatar} />
      </TouchableOpacity>

      {/* Titre centré */}
      <Text style={styles.headerTitle}>Afinder</Text>

      {/* Loupe cliquable → future page recherche */}
      <TouchableOpacity
        onPress={() => router.push("/search")}
        activeOpacity={0.8}
        style={styles.searchButton}
      >
        <Ionicons name="search-outline" size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.badge}>{event.sport}</Text>
        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={14} color="#4B5563" />
          <Text style={styles.distanceText}>
            {event.distanceKm.toFixed(1)} km
          </Text>
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
        <HomeHeader />

        <Text style={styles.sectionTitle}>Événements près de chez toi</Text>

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
    paddingTop: 8,
    backgroundColor: "#F3F4F6",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 4,
  },
  avatarButton: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  // Section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },

  // Cards
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