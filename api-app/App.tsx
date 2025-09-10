import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import EventsScreen from "./screens/EventsScreen";
import { initDb } from "./database/database";

export default function App() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EventsScreen />
    </SafeAreaView>
  );
}
