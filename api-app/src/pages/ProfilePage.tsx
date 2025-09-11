import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../types';
import { EventItemComponent } from '../components/EventItem';
import { EventModal } from '../components/EventModal';

//sample data (to be replaced with API data)
const dummySavedEvents: Event[] = [
    { id: '1', name: 'Jazz Festival', date: '2025-09-25', city: 'San Francisco', category: 'Music' },
];

/** user profile page showing saved events and "save the dates" feature */
export function ProfilePage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [dates, setDates] = useState<string[]>([]);
    const [newDate, setNewDate] = useState('');

    return (
        <View style={styles.container}>
        //Header with settings icon
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Username's Profile~</Text>
                <TouchableOpacity>
            //TO DO: add ability to change username/password or add user preferences here
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

        //Saved Events
            <Text style={styles.sectionTitle}>Your saved events:</Text>
            {dummySavedEvents.length === 0 ? (
                <Text style={styles.emptyText}>No events saved yet</Text>
            ) : (
                <FlatList
                    data={dummySavedEvents}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedEvent(item)}>
                            // filters data into EventItemComponent for cleaner display
                            <EventItemComponent event={item} />
                        </TouchableOpacity>
                    )}
                />
            )}

            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

        //Save the Dates
        //TO DO: change to date type instead of strings
            <Text style={styles.sectionTitle}>Your save the dates:</Text>
            <Text style={styles.helperText}>Add dates you're free so we can recommend events</Text>

            <View style={styles.inputRow}>
                <TextInput
                    placeholder="Enter date"
                    value={newDate}
                    onChangeText={setNewDate}
                    style={styles.dateInput}
                />
                <Button
                    title="Add"
                    onPress={() => {
                        if (newDate) {
                            setDates([...dates, newDate]);
                            setNewDate('');
                        }
                    }}
                />
            </View>

    // Display saved dates with delete option
            {dates.map((date, index) => (
                <View key={index} style={styles.dateRow}>
                    <Text>{date}</Text>
                    <TouchableOpacity onPress={() => setDates(dates.filter((_, i) => i !== index))}>
                        <Text style={styles.deleteIcon}>❌</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsIcon: {
        fontSize: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontStyle: 'italic',
        marginTop: 8,
    },
    helperText: {
        marginBottom: 8,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    dateInput: {
        flex: 1,
        borderWidth: 1,
        padding: 6,
        marginRight: 8,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    deleteIcon: {
        fontSize: 16,
    },
});