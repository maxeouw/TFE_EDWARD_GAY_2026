// app/(tabs)/groups.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
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
};

const initialGroups: Group[] = [
    {
        id: "1",
        name: "Foot du dimanche",
        sport: "Football",
        members: 8,
        maxMembers: 10,
        location: "Bruxelles - Parc Cinquantenaire",
    },
    {
        id: "2",
        name: "Running matin",
        sport: "Running",
        members: 4,
        maxMembers: 6,
        location: "Bruxelles - Bois de la Cambre",
    },
    {
        id: "3",
        name: "Basket 3x3 afterwork",
        sport: "Basketball",
        members: 3,
        maxMembers: 4,
        location: "Bruxelles - Ixelles",
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
    const [groups, setGroups] = useState<Group[]>(initialGroups);

    const handleJoin = (group: Group) => {
        // TODO: ici tu feras l'appel Firestore pour rejoindre le groupe
        setGroups((prev) =>
            prev.map((g) =>
                g.id === group.id && g.members < g.maxMembers
                    ? { ...g, members: g.members + 1 }
                    : g
            )
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={styles.container}>
                <Text style={styles.title}>Groupes à rejoindre</Text>
                <Text style={styles.subtitle}>
                    Rejoins un groupe près de chez toi pour faire du sport ensemble.
                </Text>

                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GroupCard group={item} onJoin={handleJoin} />
                    )}
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
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 16,
    },

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
