// app/(tabs)/index.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
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
  startsInMinutes?: number; // minutes avant le début
  remainingSlots?: number;
  totalSlots?: number;
};

const PROFILE_PHOTO_URL =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&w=256&h=256&q=80";

const SPORT_ICONS: Record<string, string> = {
  Tous: "apps-outline",
  Football: "football-outline",
  Running: "walk-outline",
  Basketball: "basketball-outline",
  Tennis: "tennisball-outline",
  Cyclisme: "bicycle-outline",
  Natation: "water-outline",
};

const MOCK_EVENTS: Event[] = [
  { id: "1", title: "Match de foot 5v5", sport: "Football", distanceKm: 1.2, startsInMinutes: 25, remainingSlots: 2, totalSlots: 10 },
  { id: "2", title: "Session running park", sport: "Running", distanceKm: 3.5, startsInMinutes: 90, remainingSlots: 5, totalSlots: 6 },
  { id: "3", title: "Basket 3x3", sport: "Basketball", distanceKm: 2.1, startsInMinutes: 45, remainingSlots: 1, totalSlots: 4 },
  { id: "4", title: "Foot en salle", sport: "Football", distanceKm: 0.8, startsInMinutes: 200, remainingSlots: 8, totalSlots: 10 },
  { id: "5", title: "Run matinal", sport: "Running", distanceKm: 1.9, startsInMinutes: 15, remainingSlots: 3, totalSlots: 6 },
  { id: "6", title: "Match de tennis", sport: "Tennis", distanceKm: 4.2, startsInMinutes: 110, remainingSlots: 1, totalSlots: 2 },
];

// ── Helpers ──────────────────────────────────────────────
function formatTime(minutes: number): string {
  if (minutes < 60) return `Dans ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `Dans ${h}h${m}` : `Dans ${h}h`;
}

function urgencyColor(minutes: number): string {
  if (minutes <= 30) return "#EF4444"; // rouge
  if (minutes <= 60) return "#F97316"; // orange
  return "#22C55E";                    // vert
}

// ── HomeHeader ────────────────────────────────────────────
function HomeHeader() {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        activeOpacity={0.8}
        style={styles.avatarButton}
      >
        <Image source={{ uri: PROFILE_PHOTO_URL }} style={styles.avatar} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Afinder</Text>

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

// ── UrgentEventCard ───────────────────────────────────────
function UrgentEventCard({ event }: { event: Event }) {
  const minutes = event.startsInMinutes ?? 0;
  const color = urgencyColor(minutes);

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.urgentCard}>
      {/* Badge temps */}
      <View style={[styles.urgentBadge, { backgroundColor: color + "1A", borderColor: color + "40" }]}>
        <Ionicons name="time-outline" size={12} color={color} />
        <Text style={[styles.urgentBadgeText, { color }]}>
          {formatTime(minutes)}
        </Text>
      </View>

      <Text style={styles.urgentTitle} numberOfLines={1}>
        {event.title}
      </Text>

      <View style={styles.urgentFooter}>
        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text style={styles.urgentMeta}>{event.distanceKm.toFixed(1)} km</Text>
        </View>
        {event.remainingSlots !== undefined && (
          <View style={styles.distanceRow}>
            <Ionicons name="people-outline" size={12} color="#6B7280" />
            <Text style={styles.urgentMeta}>{event.remainingSlots} place{event.remainingSlots > 1 ? "s" : ""}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── SportFilters ──────────────────────────────────────────
function SportFilters({
  sports,
  selected,
  onSelect,
}: {
  sports: string[];
  selected: string;
  onSelect: (sport: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {sports.map((sport) => {
        const isSelected = selected === sport;
        const iconName = (SPORT_ICONS[sport] ?? "fitness-outline") as any;
        return (
          <TouchableOpacity
            key={sport}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(sport)}
            activeOpacity={0.8}
          >
            <Ionicons name={iconName} size={14} color={isSelected ? "#FFFFFF" : "#4B5563"} />
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {sport}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ── EventCard ─────────────────────────────────────────────
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

// ── HomeScreen ────────────────────────────────────────────
export default function HomeScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState("Tous");

  const sportsList = useMemo(() => {
    const unique = Array.from(new Set(events.map((e) => e.sport)));
    return ["Tous", ...unique];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedSport === "Tous") return events;
    return events.filter((e) => e.sport === selectedSport);
  }, [events, selectedSport]);

  // Événements urgents : commencent dans moins de 2h
  const urgentEvents = useMemo(() =>
    events
      .filter((e) => (e.startsInMinutes ?? 999) <= 120)
      .sort((a, b) => (a.startsInMinutes ?? 0) - (b.startsInMinutes ?? 0)),
    [events]
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission localisation refusée");
        setLoading(false);
        return;
      }
      await Location.getCurrentPositionAsync({});
      setEvents(MOCK_EVENTS);
      setLoading(false);
    })();
  }, []);

  if (loading || errorMsg) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.center}>
          {loading && <ActivityIndicator />}
          {errorMsg && <Text>{errorMsg}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        {/* ── Section : Événements urgents ── */}
        {urgentEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="flash" size={16} color="#EF4444" />
                <Text style={styles.sectionTitle}>Ça commence bientôt</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
            >
              {urgentEvents.map((event) => (
                <UrgentEventCard key={event.id} event={event} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Section : Événements près de chez toi ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Près de chez toi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <SportFilters
            sports={sportsList}
            selected={selectedSport}
            onSelect={setSelectedSport}
          />

          <View style={styles.eventsContainer}>
            {filteredEvents.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={32} color="#D1D5DB" />
                <Text style={styles.emptyText}>Aucun événement "{selectedSport}"</Text>
              </View>
            ) : (
              <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <EventCard event={item} />}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 4 }}
              />
            )}
          </View>
        </View>

        {/* ── Section placeholder : Groupes actifs ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Groupes actifs près de toi</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
            <Ionicons name="people-outline" size={28} color="#D1D5DB" />
            <Text style={styles.placeholderText}>Bientôt disponible</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 32 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 0,
  },
  avatarButton: { width: 40, height: 40 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: "#E5E7EB" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827", letterSpacing: 0.5 },
  searchButton: { width: 40, height: 40, alignItems: "flex-end", justifyContent: "center" },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  seeAll: { fontSize: 13, color: "#2563EB", fontWeight: "500" },

  // Urgent cards (scroll horizontal)
  urgentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  urgentBadgeText: { fontSize: 11, fontWeight: "700" },
  urgentTitle: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 8 },
  urgentFooter: { flexDirection: "row", gap: 10 },
  urgentMeta: { fontSize: 11, color: "#6B7280" },

  // Filtres
  filtersContainer: { paddingBottom: 10, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  chipText: { fontSize: 13, fontWeight: "500", color: "#4B5563" },
  chipTextSelected: { color: "#FFFFFF", fontWeight: "600" },

  // Conteneur liste événements
  eventsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    maxHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Cards événements
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
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
  eventTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },

  // Placeholders
  placeholderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  placeholderText: { fontSize: 13, color: "#9CA3AF" },
});