// app/create-event.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function CreateEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalSlots, setTotalSlots] = useState("10");
  const [locationName, setLocationName] = useState("");

  const handleSubmit = () => {
    // TODO: envoi vers Firestore
    console.log({
      title,
      sport,
      date,
      time,
      totalSlots: Number(totalSlots),
      locationName,
    });

    router.back(); // pour l’instant, on revient à la page précédente
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Créer un événement</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Match de foot 5v5"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Sport</Text>
          <TextInput
            style={styles.input}
            placeholder="Football, Basket, Running..."
            value={sport}
            onChangeText={setSport}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="JJ/MM/AAAA"
              value={date}
              onChangeText={setDate}
            />
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Heure</Text>
            <TextInput
              style={styles.input}
              placeholder="18:30"
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Lieu</Text>
          <TextInput
            style={styles.input}
            placeholder="Parc du Cinquantenaire"
            value={locationName}
            onChangeText={setLocationName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nombre de places</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            keyboardType="numeric"
            value={totalSlots}
            onChangeText={setTotalSlots}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Publier l’événement</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: "#F3F4F6",
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 24, color: "#111827" },

  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#4B5563", marginBottom: 6 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },

  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
