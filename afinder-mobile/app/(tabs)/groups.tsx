// app/(tabs)/groups.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Group = {
  id: string;
  name: string;
  sport: string;
  members: number;
  maxMembers: number;
  location: string;
  distanceKm?: number;
};

const allGroups: Group[] = [
  {
    id: "1",
    name: "Foot du dimanche",
    sport: "Football",
    members: 8,
    maxMembers: 10,
    location: "Bruxelles - Parc Cinquantenaire",
    distanceKm: 1.2,
  },
  {
    id: "2",
    name: "Running matin",
    sport: "Running",
    members: 4,
    maxMembers: 6,
    location: "Bruxelles - Bois de la Cambre",
    distanceKm: 3.5,
  },
  {
    id: "3",
    name: "Basket 3x3 afterwork",
    sport: "Basketball",
    members: 3,
    maxMembers: 4,
    location: "Bruxelles - Ixelles",
    distanceKm: 2.1,
  },
  {
    id: "4",
    name: "Foot en salle LLN",
    sport: "Football",
    members: 5,
    maxMembers: 10,
    location: "Louvain-la-Neuve",
    distanceKm: 0.8,
  },
  {
    id: "5",
    name: "Yoga débutant",
    sport: "Yoga",
    members: 6,
    maxMembers: 8,
    location: "Bruxelles - Centre",
    distanceKm: 4.7,
  },
];

function GroupCard({
  group,
  onJoin,
}: {
  group: Group;
  onJoin: (group: Group) => void;
}) {
  const isFull = group.members >= group.maxMembers;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.groupName} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={styles.badge}>{group.sport}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={14} color="#6B7280" />
        <Text style={styles.location} numberOfLines={1}>
          {group.location}
        </Text>
        {typeof group.distanceKm === "number" && (
          <Text style={styles.distanceText}>{group.distanceKm.toFixed(1)} km</Text>
        )}
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Ionicons name="people-outline" size={16} color="#4B5563" />
          <Text style={styles.membersText}>
            {group.members}/{group.maxMembers} membres
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
          disabled={isFull}
          onPress={() => onJoin(group)}
        >
          <Text style={styles.joinButtonText}>
            {isFull ? "Complet" : "Rejoindre"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>(allGroups);
  const [search, setSearch] = useState("");

  const handleJoin = (group: Group) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === group.id && g.members < g.maxMembers
          ? { ...g, members: g.members + 1 }
          : g
      )
    );
  };

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const lower = search.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(lower) ||
        g.sport.toLowerCase().includes(lower) ||
        g.location.toLowerCase().includes(lower)
    );
  }, [groups, search]);

  const nearbySuggestions = useMemo(
    () =>
      groups
        .filter((g) => typeof g.distanceKm === "number" && g.distanceKm! <= 3)
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
        .slice(0, 5),
    [groups]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Text style={styles.title}>Groupes</Text>
        <Text style={styles.subtitle}>
          Trouve un groupe près de chez toi ou cherche un sport spécifique.
        </Text>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un groupe, un sport, une ville..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions à proximité */}
        {nearbySuggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>À proximité</Text>
              <Text style={styles.suggestionsCount}>
                {nearbySuggestions.length} suggestion(s)
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsList}
            >
              {nearbySuggestions.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.suggestionChip}
                  onPress={() => setSearch(group.name)}
                >
                  <Text style={styles.suggestionName} numberOfLines={1}>
                    {group.name}
                  </Text>
                  {typeof group.distanceKm === "number" && (
                    <Text style={styles.suggestionDistance}>
                      {group.distanceKm.toFixed(1)} km
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Liste principale de groupes */}
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupCard group={item} onJoin={handleJoin} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ marginTop: 24, alignItems: "center" }}>
              <Text style={{ color: "#6B7280" }}>
                Aucun groupe ne correspond à ta recherche.
              </Text>
            </View>
          }
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // Suggestions
  suggestionsSection: {
    marginBottom: 12,
  },
  suggestionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  suggestionsCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  suggestionsList: {
    paddingVertical: 4,
  },
  suggestionChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  suggestionName: {
    fontSize: 13,
    color: "#111827",
    maxWidth: 140,
  },
  suggestionDistance: {
    fontSize: 12,
    color: "#6B7280",
  },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  location: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    color: "#6B7280",
  },
  membersText: {
    fontSize: 13,
    color: "#4B5563",
  },
  joinButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },
  joinButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});
