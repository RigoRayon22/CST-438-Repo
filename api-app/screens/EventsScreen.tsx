import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import {
  initDb,
  addEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  clearEvents,
  logEvents,
  type EventRow,
} from "../database/database";

export default function EventsScreen() {
  // Form fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [radius, setRadius] = useState(""); 

  // Table state
  const [events, setEvents] = useState<EventRow[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      await initDb();
      await refresh();
    })();
  }, []);

  async function refresh() {
    const rows = await getEvents();
    setEvents(rows);
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setLocation("");
    setEventDate("");
    setRadius("");
  }

  function validate(): { ok: boolean; msg?: string } {
    if (!name.trim()) return { ok: false, msg: "Event name is required." };
    if (!location.trim()) return { ok: false, msg: "Location is required." };
    if (!eventDate.trim()) return { ok: false, msg: "Event date is required." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim()))
      return { ok: false, msg: "Use date format YYYY-MM-DD." };
    const r = Number(radius);
    if (!Number.isFinite(r) || r < 0)
      return { ok: false, msg: "Radius must be a non-negative number." };
    return { ok: true };
  }

  /** Saves event and logs CRUD */
  async function onSubmit() {
    const v = validate();
    if (!v.ok) {
      Alert.alert("Invalid Input", v.msg);
      return;
    }
    const payload = {
      name: name.trim(),
      location: location.trim(),
      event_date: eventDate.trim(),
      radius: Number(radius),
    };

    if (editingId == null) {
      // CREATE
      const newId = await addEvent(payload);
      console.log("CRUD> Created event id:", newId);

      const created = await getEvent(Number(newId));
      console.log("CRUD> Read just-created:", created);

      await logEvents("CRUD> After create (all)");
    } else {
      // UPDATE
      await updateEvent(editingId, payload);
      console.log("CRUD> Updated event id:", editingId);

      const updated = await getEvent(Number(editingId));
      console.log("CRUD> Read just-updated:", updated);

      await logEvents("CRUD> After update (all)");
    }

    await refresh();
    resetForm();
  }

  async function onEdit(row: EventRow) {
    setEditingId(row.id);
    setName(row.name);
    setLocation(row.location);
    setEventDate(row.event_date);
    setRadius(String(row.radius));
  }

  async function onDelete(id: number) {
    await deleteEvent(id);
    console.log("CRUD> Deleted event id:", id);
    await logEvents("CRUD> After delete (all)");
    if (editingId === id) resetForm();
    await refresh();
  }

  async function onSeed() {
    await initDb();

    // CREATE two rows
    const id1 = await addEvent({
      name: "Warriors vs. Lakers",
      location: "San Francisco, CA",
      event_date: "2025-10-11",
      radius: 15,
    });
    const id2 = await addEvent({
      name: "Wicked (Tour)",
      location: "San Francisco, CA",
      event_date: "2025-10-12",
      radius: 10,
    });
    console.log("CRUD> Seed created ids:", id1, id2);

    await logEvents("CRUD> After seed (all)");

    // show an update and delete in logs
    const one = await getEvent(Number(id1));
    if (one) {
      await updateEvent(one.id, { ...one, name: one.name + " [Updated]" });
      console.log("CRUD> Updated seeded id1");
      await logEvents("CRUD> After seed update (all)");
    }

    await deleteEvent(Number(id2));
    console.log("CRUD> Deleted seeded id2");
    await logEvents("CRUD> After seed delete (all)");

    await refresh();
  }

  async function onClearAll() {
    await clearEvents();
    console.log("CRUD> Cleared all events");
    await logEvents("CRUD> After clear (all)");
    await refresh();
    resetForm();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Browse all events</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Row 1: Event name */}
          <View style={styles.row}>
            <Text style={styles.label}>Event name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., The Lumineers: Live"
              style={styles.input}
              returnKeyType="done"
            />
          </View>

          {/* Row 2: Location */}
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., San Francisco, CA"
              style={styles.input}
              returnKeyType="done"
            />
          </View>

          {/* Row 3: Event date */}
          <View style={styles.row}>
            <Text style={styles.label}>Event date</Text>
            <TextInput
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
            />
          </View>

          {/* Row 4: Radius */}
          <View style={styles.row}>
            <Text style={styles.label}>Radius</Text>
            <TextInput
              value={radius}
              onChangeText={setRadius}
              placeholder="e.g., 25"
              style={styles.input}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onSubmit}>
              <Text style={styles.btnPrimaryText}>
                {editingId == null ? "Save event" : "Update event"}
              </Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnGhost]} onPress={resetForm}>
              <Text style={styles.btnGhostText}>Clear form</Text>
            </Pressable>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={{ color: "#6b7280", padding: 16 }}>
              No events yet — add one above.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.location} • {item.event_date} • {item.radius} mi
                </Text>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => onEdit(item)}
                  style={[styles.smallBtn, styles.smallBtnOutline]}
                  accessibilityLabel="Edit event"
                >
                  <Text style={styles.smallBtnOutlineText}>Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => onDelete(item.id)}
                  style={[styles.smallBtn, styles.smallBtnDanger]}
                  accessibilityLabel="Delete event"
                >
                  <Text style={styles.smallBtnDangerText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        {/* Tools for testing */}
        <View style={{ padding: 16, gap: 10 }}>
          <Button title="Seed sample event (with CRUD log)" onPress={onSeed} />
          <Button title="Print all events to log" onPress={() => logEvents("Manual log")} />
          <Button title="Clear all events" color="#ef4444" onPress={onClearAll} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" },

  form: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  row: { gap: 6 },
  label: { fontWeight: "700", color: "#111827" },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  btn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
  },
  btnPrimary: { backgroundColor: "#111827", borderColor: "#111827" },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnGhost: { backgroundColor: "#fff", borderColor: "#e5e7eb" },
  btnGhostText: { color: "#111827", fontWeight: "700" },

  list: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  card: {
    borderWidth: 1,
    borderColor: "#ececec",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { height: 3, width: 0 },
      },
      android: { elevation: 1 },
    }),
  },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardMeta: { color: "#6b7280", marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  smallBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtnOutline: { borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "#fff" },
  smallBtnOutlineText: { color: "#111827", fontWeight: "700" },
  smallBtnDanger: { borderWidth: 1, borderColor: "#ef4444", backgroundColor: "#fff" },
  smallBtnDangerText: { color: "#ef4444", fontWeight: "700" },
});
