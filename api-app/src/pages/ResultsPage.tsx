import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { EventItemComponent } from '../components/EventItem';
import { EventModal } from '../components/EventModal';
import { Event } from '../../types';
import { searchEvents } from "../api/ticketmaster";

/** allows users to view search results and click on events for more details */
export function ResultsPage({ navigation, route }: any) {
    const { keyword } = route.params;
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
    async function fetchEvents() {
      try {
        const results = await searchEvents(keyword);
        setEvents(results);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvents();
    }, [keyword]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Search Results</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedEvent(item)}>
                        {/* filters data into EventItemComponent for cleaner display */}
                        <EventItemComponent event={item} />
                    </TouchableOpacity>
                )}
            />

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    backLink: {
        color: 'blue',
        marginBottom: 8,
        marginTop: 12,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});