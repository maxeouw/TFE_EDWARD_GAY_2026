// components/map-screen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  Keyboard,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Event = {
  id: string;
  title: string;
  sport: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
};

const mockEvents: Event[] = [
  { id: "1", title: "Foot 5v5", sport: "Football", distanceKm: 1.2, latitude: 50.8503, longitude: 4.3517 },
  { id: "2", title: "Running Parc", sport: "Running", distanceKm: 3.5, latitude: 50.845, longitude: 4.365 },
  { id: "3", title: "Basket 3x3", sport: "Basketball", distanceKm: 2.1, latitude: 50.858, longitude: 4.340 },
  { id: "4", title: "Foot en salle", sport: "Football", distanceKm: 0.8, latitude: 50.843, longitude: 4.358 },
  { id: "5", title: "Tennis double", sport: "Tennis", distanceKm: 4.2, latitude: 50.862, longitude: 4.372 },
];

const INITIAL_REGION = {
  latitude: 50.8503,
  longitude: 4.3517,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function sportColor(sport: string): string {
  const map: Record<string, string> = {
    Football: "#2563EB",
    Running: "#16A34A",
    Basketball: "#EA580C",
    Tennis: "#CA8A04",
  };
  return map[sport] ?? "#6B7280";
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Suggestions filtrées selon la query
  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q === "") return [];
    return mockEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.sport.toLowerCase().includes(q)
    );
  }, [query]);

  const mapRef = React.useRef<MapView>(null);

  // Centrer la carte sur un événement sélectionné
  function focusEvent(event: Event) {
    mapRef.current?.animateToRegion(
      {
        latitude: event.latitude,
        longitude: event.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
    setQuery(event.title);
    setIsFocused(false);
    Keyboard.dismiss();
  }

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <View style={styles.container}>
      {/* ── Carte ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        onPress={() => {
          setIsFocused(false);
          Keyboard.dismiss();
        }}
      >
        {mockEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            pinColor={sportColor(event.sport)}
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

      {/* ── Barre de recherche flottante ── */}
      <View style={[styles.searchWrapper, { top: 20 }]}>
        {/* Input */}
        <View style={[styles.searchBar, showSuggestions && styles.searchBarOpen]}>
          <Ionicons name="search-outline" size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un événement ou un sport..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            returnKeyType="search"
            onSubmitEditing={() => {
              if (suggestions.length > 0) focusEvent(suggestions[0]);
            }}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setIsFocused(false);
              }}
            >
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsList}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.suggestionRow,
                    index < suggestions.length - 1 && styles.suggestionBorder,
                  ]}
                  onPress={() => focusEvent(item)}
                  activeOpacity={0.75}
                >
                  {/* Pastille sport */}
                  <View
                    style={[
                      styles.sportDot,
                      { backgroundColor: sportColor(item.sport) + "22" },
                    ]}
                  >
                    <View
                      style={[
                        styles.sportDotInner,
                        { backgroundColor: sportColor(item.sport) },
                      ]}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionTitle}>{item.title}</Text>
                    <Text style={styles.suggestionMeta}>
                      {item.sport} · {item.distanceKm.toFixed(1)} km
                    </Text>
                  </View>

                  <Ionicons name="navigate-outline" size={14} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // Wrapper flottant
  searchWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 10,
  },

  // Barre
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  searchBarOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // Suggestions
  suggestionsList: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sportDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sportDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  suggestionMeta: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },

  // Callout
  callout: { maxWidth: 200, padding: 4 },
  calloutTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 2 },
  calloutSport: { fontSize: 13, color: "#4B5563", marginBottom: 2 },
  calloutDistance: { fontSize: 12, color: "#6B7280" },
});