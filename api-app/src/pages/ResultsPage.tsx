import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { EventItemComponent } from '../components/EventItem';
import { EventModal } from '../components/EventModal';
import { Event } from '../../types';

//sample data (to be replaced with API data)
const dummyResults: Event[] = [
    { id: '1', name: 'Concert in LA', date: '2025-09-15', city: 'Los Angeles', category: 'Music' },
    { id: '2', name: 'Art Expo', date: '2025-09-20', city: 'San Diego', category: 'Art' },
];

/** allows users to view search results and click on events for more details */
export function ResultsPage({ navigation }: any) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <View style={styles.container}>
            {/*Link back to search page to update search criteria*/}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backLink}>← Update search</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Search Results</Text>

            <FlatList
                data={dummyResults}
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