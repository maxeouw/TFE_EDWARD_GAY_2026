// app/search.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// ── Types ─────────────────────────────────────────────────
type ResultType = "event" | "group" | "person";

type SearchResult = {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  meta?: string;
  avatarUrl?: string;
};

// ── Mock data ─────────────────────────────────────────────
const MOCK_DATA: SearchResult[] = [
  // Événements
  { id: "e1", type: "event", title: "Match de foot 5v5", subtitle: "Football · 1.2 km", meta: "Dans 25 min" },
  { id: "e2", type: "event", title: "Session running Bois", subtitle: "Running · 3.5 km", meta: "Dans 1h30" },
  { id: "e3", type: "event", title: "Basket 3x3 Ixelles", subtitle: "Basketball · 2.1 km", meta: "Dans 45 min" },
  { id: "e4", type: "event", title: "Tennis double", subtitle: "Tennis · 4.2 km", meta: "Dans 2h" },
  // Groupes
  { id: "g1", type: "group", title: "Foot du dimanche", subtitle: "Football · 8/10 membres", meta: "1.2 km" },
  { id: "g2", type: "group", title: "Running matin", subtitle: "Running · 4/6 membres", meta: "3.5 km" },
  { id: "g3", type: "group", title: "Basket afterwork", subtitle: "Basketball · 3/4 membres", meta: "2.1 km" },
  // Personnes
  {
    id: "p1", type: "person", title: "Lucas Martin", subtitle: "Football, Running",
    meta: "2.3 km",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=128&h=128&q=80",
  },
  {
    id: "p2", type: "person", title: "Sarah Dubois", subtitle: "Tennis, Yoga",
    meta: "1.8 km",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=128&h=128&q=80",
  },
  {
    id: "p3", type: "person", title: "Tom Leroy", subtitle: "Basketball, Running",
    meta: "4.0 km",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=128&h=128&q=80",
  },
];

const TABS: { key: ResultType | "all"; label: string; icon: string }[] = [
  { key: "all",    label: "Tout",       icon: "apps-outline" },
  { key: "event",  label: "Événements", icon: "calendar-outline" },
  { key: "group",  label: "Groupes",    icon: "people-outline" },
  { key: "person", label: "Personnes",  icon: "person-outline" },
];

// ── Helpers ───────────────────────────────────────────────
function typeIcon(type: ResultType): string {
  if (type === "event")  return "calendar-outline";
  if (type === "group")  return "people-outline";
  return "person-outline";
}

function typeColor(type: ResultType): string {
  if (type === "event")  return "#4F46E5";
  if (type === "group")  return "#0891B2";
  return "#059669";
}

function typeBg(type: ResultType): string {
  if (type === "event")  return "#EEF2FF";
  if (type === "group")  return "#E0F2FE";
  return "#D1FAE5";
}

// ── ResultRow ─────────────────────────────────────────────
function ResultRow({ item }: { item: SearchResult }) {
  const color = typeColor(item.type);
  const bg    = typeBg(item.type);

  return (
    <TouchableOpacity style={styles.resultRow} activeOpacity={0.75}>
      {/* Avatar ou icône */}
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.iconBox, { backgroundColor: bg }]}>
          <Ionicons name={typeIcon(item.type) as any} size={18} color={color} />
        </View>
      )}

      {/* Texte */}
      <View style={styles.resultText}>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>

      {/* Meta (distance / temps) */}
      {item.meta && (
        <Text style={styles.resultMeta}>{item.meta}</Text>
      )}

      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

// ── SearchScreen ──────────────────────────────────────────
export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ResultType | "all">("all");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    return MOCK_DATA.filter((item) => {
      const matchTab = activeTab === "all" || item.type === activeTab;
      const matchQuery =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [query, activeTab]);

  // Grouper les résultats par type pour afficher des headers de section
  const grouped = useMemo(() => {
    if (activeTab !== "all") return null;

    const order: ResultType[] = ["event", "group", "person"];
    const labels: Record<ResultType, string> = {
      event: "Événements",
      group: "Groupes",
      person: "Personnes",
    };

    return order.flatMap((type) => {
      const items = results.filter((r) => r.type === type);
      if (items.length === 0) return [];
      return [
        { id: `header-${type}`, type: "header" as const, label: labels[type] },
        ...items,
      ];
    });
  }, [results, activeTab]);

  const listData = grouped ?? results;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* ── Barre de recherche + retour ── */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Rechercher un événement, groupe, personne..."
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Tabs filtre ── */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={isActive ? "#2563EB" : "#6B7280"}
              />
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Résultats ── */}
      <FlatList
        data={listData as any[]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          // Header de section (mode "Tout")
          if (item.type === "header") {
            return <Text style={styles.sectionHeader}>{item.label}</Text>;
          }
          return <ResultRow item={item} />;
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>Aucun résultat</Text>
            <Text style={styles.emptySubtitle}>
              Essaie un autre mot-clé ou change de filtre
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },

  // Barre de recherche
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: "#F3F4F6",
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // Tabs
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  tabText: { fontSize: 12, fontWeight: "500", color: "#6B7280" },
  tabTextActive: { color: "#2563EB", fontWeight: "600" },

  // Liste
  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 6,
  },

  // Ligne de résultat
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  resultText: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  resultSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  resultMeta: { fontSize: 12, color: "#9CA3AF" },

  // Empty state
  emptyState: {
    alignItems: "center",
    marginTop: 64,
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  emptySubtitle: { fontSize: 13, color: "#9CA3AF", textAlign: "center" },
});