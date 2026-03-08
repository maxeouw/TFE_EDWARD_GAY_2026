// app/profile.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router"; // si tu veux un bouton "Déconnexion" plus tard

export default function ProfileScreen() {
    const user = {
        displayName: "John Doe",
        email: "john.doe@example.com",
        favoriteSport: "Football",
    };

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={{
                            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&w=256&h=256&q=80",
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{user.displayName}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations</Text>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Sport préféré</Text>
                        <Text style={styles.rowValue}>{user.favoriteSport}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Événements créés</Text>
                        <Text style={styles.rowValue}>12</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Événements rejoints</Text>
                        <Text style={styles.rowValue}>27</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Compte</Text>

                    <TouchableOpacity style={styles.buttonSecondary}>
                        <Text style={styles.buttonSecondaryText}>Modifier le profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonDanger}>
                        <Text style={styles.buttonDangerText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },

    header: { alignItems: "center", marginBottom: 24 },
    avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
    name: { fontSize: 22, fontWeight: "700", color: "#111827" },
    email: { fontSize: 14, color: "#6B7280", marginTop: 2 },

    section: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginBottom: 12,
        textTransform: "uppercase",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    rowLabel: { fontSize: 14, color: "#4B5563" },
    rowValue: { fontSize: 14, color: "#111827", fontWeight: "500" },

    buttonSecondary: {
        marginTop: 8,
        paddingVertical: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        alignItems: "center",
    },
    buttonSecondaryText: { color: "#111827", fontWeight: "600" },

    buttonDanger: {
        marginTop: 8,
        paddingVertical: 12,
        borderRadius: 999,
        backgroundColor: "#EF4444",
        alignItems: "center",
    },
    buttonDangerText: { color: "#FFFFFF", fontWeight: "600" },
});
